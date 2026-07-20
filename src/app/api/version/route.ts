// Returns the live deployment's build id. A stale client polls this (VersionWatcher)
// and, when it differs from its own baked id, refreshes at a calm moment — so a
// production redeploy never reaches the crash-and-recover path.
export const dynamic = 'force-dynamic';

export function GET() {
    return Response.json({ id: process.env.NEXT_PUBLIC_BUILD_ID ?? 'dev' });
}
