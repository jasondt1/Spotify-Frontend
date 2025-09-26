/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: true,
    // Ensure Node can require these CJS packages at runtime
    serverComponentsExternalPackages: [
      "sadaslk-dlcore",
      "youtube-search-api",
      "ytdl-core",
      "axios",
      "dew-ytdl",
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
    return config
  },
}

export default nextConfig
