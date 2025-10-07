/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  compress: true,
  reactStrictMode: false,
  eslint: {
    // Do not fail the production build on ESLint warnings/errors
    // CI linting should be run separately via `npm run lint`
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Prevent type errors from failing production builds
    // Useful while migrating or when third-party types misbehave in CI
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: true,
    // Ensure Node can require these CJS packages at runtime
    serverComponentsExternalPackages: [
      "sadaslk-dlcore",
      "youtube-search-api",
      "ytdl-core",
      "axios",
      "dew-ytdl",
      "@google/genai",
      "ws",
    ],
  },
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Critical dependency: the request of a dependency is an expression/,
    ]
    // Only externalize axios on the server to avoid breaking client bundles
    if (isServer) {
      const externals = config.externals || []
      if (Array.isArray(externals)) {
        externals.push({ axios: "commonjs axios" })
      }
      config.externals = externals
    }

    // Aliases/fallbacks for optional/native deps that cause noisy warnings in builds
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Optional perf deps for "ws"; safe to skip bundling
      bufferutil: false,
      "utf-8-validate": false,
      // node-fetch optional legacy codec support
      encoding: false,
      // Ensure browser bundles pick the Web SDK for Google GenAI
      ...(isServer
        ? {}
        : {
            "@google/genai": "@google/genai/web",
          }),
    }
    return config
  },
}

export default nextConfig
