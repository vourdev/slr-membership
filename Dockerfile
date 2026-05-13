FROM node:24.11.0-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ===============================
# Dependencies
# ===============================
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ===============================
# Build
# ===============================
FROM base AS builder
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ===============================
# Runner
# ===============================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# === setup ENV ===
ENV AUTH_SECRET=98E3B2CC28F61492C6934531C828C
ENV NEXT_PUBLIC_API_BASE=https://apiku.samabitech.com
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app
USER nextjs

CMD ["node", "server.js"]
