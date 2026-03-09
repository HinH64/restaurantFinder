import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Produce a self-contained Node.js server in .next/standalone
  // Required for the Docker production image (copies server.js + minimal deps)
  output: 'standalone',
}

export default nextConfig
