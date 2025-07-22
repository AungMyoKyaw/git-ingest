import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SWC is enabled by default unless you have a .babelrc
  experimental: {
    // Enable persistent caching for Turbopack
    turbopackPersistentCaching: true,
    // Forward browser logs to the terminal for easier debugging
    browserDebugInfoInTerminal: true,
    // Enable new caching and pre-rendering behavior (renamed from dynamicIO)
    cacheComponents: true,
    // Activate new client-side router improvements
    clientSegmentCache: true,
    // Explore route composition and segment overrides via DevTools
    devtoolSegmentExplorer: true,
    // Enable support for global-not-found (global 404 page)
    globalNotFound: true,
    // Enable SWC trace profiling (for advanced performance debugging)
    swcTraceProfiling: false // Set to true if you want to generate SWC traces
    // Example for SWC plugins (add if you use custom plugins)
    // swcPlugins: [
    //   ["plugin-name", { /* plugin options */ }],
    // ],
  }
};

export default nextConfig;
