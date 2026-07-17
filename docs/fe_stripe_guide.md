# Panduan Frontend — Stripe Payment Pages

## Pages yang Harus Dibuat

| Route | Tujuan |
|-------|--------|
| `/payment/success` | Redirect setelah pembayaran berhasil |
| `/payment/cancel` | Redirect setelah pembayaran dibatalkan |
| `/account` | Halaman akun, return dari Billing Portal |

---

## 1. `/payment/success`

### Kapan user sampai di sini?
Setelah **berhasil bayar** di Stripe Checkout. URL akan punya query param `session_id`.

### URL Format
```
https://dev.smartliferewards.com.au/payment/success?session_id=cs_test_abc123...
```

### Yang harus dilakukan di page ini

```ts
// 1. Ambil session_id dari URL
const params = new URLSearchParams(window.location.search);
const sessionId = params.get("session_id");

// 2. Tunggu webhook selesai proses (~1-3 detik), lalu fetch membership terbaru
const res = await fetch("/api/v1/memberships/me", {
  headers: { Authorization: `Bearer ${accessToken}` },
});
const membership = await res.json();
```

### UI yang ditampilkan
- ✅ Icon sukses / animasi confetti
- Pesan: **"Pembayaran Berhasil!"**
- Detail: tier yang dipilih, amount yang dibayar
- Tombol: **"Go to Dashboard"** → redirect ke `/dashboard`

### Contoh UI Structure
```
┌─────────────────────────────────┐
│         ✅ SUCCESS!             │
│                                 │
│   Your SLR Red membership       │
│   is now active.                │
│                                 │
│   Amount: $30.00 AUD            │
│   Next billing: [date + 28d]    │
│                                 │
│   [ Go to Dashboard → ]        │
└─────────────────────────────────┘
```

> [!IMPORTANT]
> Webhook processing bisa delay 1-5 detik. Gunakan **polling** atau **retry** untuk fetch `/memberships/me` sampai `billing_status === "active"`. Contoh:

```ts
async function waitForActivation(token: string, maxRetries = 10): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    const res = await fetch("/api/v1/memberships/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.data?.billing_status === "active") return data.data;
    await new Promise((r) => setTimeout(r, 2000)); // wait 2s
  }
  throw new Error("Activation timeout");
}
```

---

## 2. `/payment/cancel`

### Kapan user sampai di sini?
User klik **back / close** di halaman Stripe Checkout (belum bayar).

### Yang harus dilakukan di page ini
- Tidak perlu API call — tidak ada transaksi yang terjadi

### UI yang ditampilkan
- ⚠️ Icon warning
- Pesan: **"Pembayaran Dibatalkan"**
- Sub-text: "Kamu belum dikenakan biaya apapun"
- Tombol: **"Coba Lagi"** → redirect ke halaman pilih tier / register
- Tombol: **"Kembali ke Home"** → redirect ke `/`

### Contoh UI Structure
```
┌─────────────────────────────────┐
│       ⚠️ Payment Cancelled     │
│                                 │
│   No charges were made to       │
│   your account.                 │
│                                 │
│   [ Try Again ]  [ Home ]       │
└─────────────────────────────────┘
```

---

## 3. `/account` (Billing Section)

### Kapan user sampai di sini?
- Navigasi biasa dari dashboard
- Return dari Stripe Billing Portal

### API Calls yang dibutuhkan

```ts
// 1. Get billing status
GET /api/v1/billing/status
→ { billing_status, next_renewal_at, grace_period, stripe_subscription_id }

// 2. Get invoices / payment history
GET /api/v1/billing/invoices?page=1&per_page=10
→ { items: [...], meta: { page, per_page, total, total_pages } }

// 3. Get membership info
GET /api/v1/memberships/me
→ { tier, sub_tier, billing_status, current_cycle, ... }

// 4. Open Stripe Billing Portal (manage cards, cancel, etc.)
POST /api/v1/stripe/portal
→ { url: "https://billing.stripe.com/session/..." }
// → window.location.href = data.data.url
```

### UI yang ditampilkan
```
┌─────────────────────────────────────────────┐
│  MY ACCOUNT                                 │
│                                             │
│  ┌─ Membership ──────────────────────────┐  │
│  │  Tier: SLR Red · Premium              │  │
│  │  Status: ● Active                     │  │
│  │  Next Billing: 8 Aug 2026             │  │
│  │                                       │  │
│  │  [ Manage Billing → ]                 │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌─ Payment History ─────────────────────┐  │
│  │  #    Date        Amount    Status    │  │
│  │  1    10 Jul 26   $30.00    ✅ Paid   │  │
│  │  2    12 Jun 26   $30.00    ✅ Paid   │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

> [!NOTE]
> Tombol **"Manage Billing"** memanggil `POST /api/v1/stripe/portal`, lalu redirect ke URL yang dikembalikan. Di Stripe Portal, user bisa ganti kartu atau cancel subscription. Setelah selesai, Stripe redirect balik ke `/account`.

---

## API Reference Lengkap

### `POST /api/v1/stripe/checkout` — Buat Checkout Session
```ts
// Request (auth required)
{ "tier": "RED" | "BLUE", "couponId"?: "Gia1HlaW" }

// Response 200
{
  "success": true,
  "data": {
    "url": "https://checkout.stripe.com/c/pay/cs_test_...",
    "sessionId": "cs_test_..."
  }
}

// → window.location.href = data.data.url
```

---

### `POST /api/v1/stripe/portal` — Buka Billing Portal
```ts
// Request (auth required, no body)

// Response 200
{
  "success": true,
  "data": {
    "url": "https://billing.stripe.com/p/session/..."
  }
}

// → window.location.href = data.data.url
```

---

### `GET /api/v1/billing/status` — Cek Status Billing
```ts
// Response 200
{
  "success": true,
  "data": {
    "billing_status": "active" | "grace" | "inactive",
    "next_renewal_at": "2026-08-08T14:30:00.000Z" | null,
    "grace_period": {
      "started_at": "...",
      "expires_at": "..."
    } | null,
    "stripe_subscription_id": "sub_xxx" | null
  }
}
```

---

### `GET /api/v1/billing/invoices` — History Pembayaran
```ts
// Query params: ?page=1&per_page=10

// Response 200
{
  "success": true,
  "data": {
    "items": [
      {
        "invoice_id": "uuid",
        "amount_cents": 3000,        // $30.00
        "discount_cents": 0,
        "stripe_invoice_id": "in_xxx",
        "paid_at": "2026-07-10T14:30:00.000Z",
        "type": "initial" | "renewal" | "manual_grace"
      }
    ],
    "meta": { "page": 1, "per_page": 10, "total": 5, "total_pages": 1 }
  }
}
```

---

## Complete Flow Diagram

```
┌──────────────────── REGISTRATION FLOW ────────────────────┐
│                                                           │
│  Register → Select Tier → [Spin Wheel?] → Review Order   │
│                                  │                        │
│                     POST /api/v1/stripe/checkout           │
│                                  │                        │
│                        ┌─────────▼──────────┐             │
│                        │  Stripe Checkout    │             │
│                        │  (external page)    │             │
│                        └────┬──────────┬─────┘             │
│                    Paid ✅  │          │  Cancel ❌         │
│                             ▼          ▼                   │
│                    /payment/success    /payment/cancel      │
│                             │                              │
│                    Poll /memberships/me                     │
│                    until active                             │
│                             │                              │
│                        /dashboard                          │
└───────────────────────────────────────────────────────────┘

┌──────────────────── BILLING PORTAL FLOW ──────────────────┐
│                                                           │
│  /account → "Manage Billing"                              │
│                    │                                      │
│       POST /api/v1/stripe/portal                          │
│                    │                                      │
│           ┌────────▼─────────┐                            │
│           │  Stripe Portal   │  (ganti kartu, cancel,     │
│           │  (external page) │   lihat invoice)            │
│           └────────┬─────────┘                            │
│                    │ "Back"                                │
│                    ▼                                      │
│                 /account                                  │
└───────────────────────────────────────────────────────────┘
```

---

## Test Cards (Sandbox)

| Nomor Kartu | Hasil |
|---|---|
| `4242 4242 4242 4242` | ✅ Sukses |
| `4000 0000 0000 0002` | ❌ Declined |
| `4000 0000 0000 9995` | ❌ Insufficient funds |

**Expiry**: tanggal apapun di masa depan (e.g. `12/30`)  
**CVC**: 3 digit apapun (e.g. `123`)
