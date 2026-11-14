import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Serve build-time (SSG) pages from the deployed static assets. Without an
// incremental cache, routes with `dynamicParams = false` (help articles and
// collections, city pages, vendor trades, software pages) 404 on Cloudflare
// because OpenNext cannot find their prerendered HTML, and every other static
// page is re-rendered per request, which blows the Workers CPU limit (error
// 1102). Read-only: matches how these pages were served on Vercel (built once
// per deploy, no ISR). Cache interception answers prerendered pages before the
// Next server loads; it runs after middleware, so host rewrites still apply.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
