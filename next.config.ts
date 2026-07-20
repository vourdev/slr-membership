import type { NextConfig } from 'next';

import initializeBundleAnalyzer from '@next/bundle-analyzer';

// https://www.npmjs.com/package/@next/bundle-analyzer
const withBundleAnalyzer = initializeBundleAnalyzer({
    enabled: process.env.BUNDLE_ANALYZER_ENABLED === 'true'
});

// Unique per build so the client can detect a redeploy (see /api/version +
// VersionWatcher). CI ids preferred; Date.now() guarantees a fresh value otherwise.
const BUILD_ID =
    process.env.NEXT_PUBLIC_BUILD_ID ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.BUILD_ID ||
    String(Date.now());

const nextConfig: NextConfig = {
    output: 'standalone',
    env: {
        NEXT_PUBLIC_BUILD_ID: BUILD_ID
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'apiku.samabitech.com'
            },
            {
                protocol: 'https',
                hostname: 'object.smartliferewards.com.au'
            }
        ]
    }
};

export default withBundleAnalyzer(nextConfig);
