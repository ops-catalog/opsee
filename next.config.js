/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    CATALOG_URL: process.env.CATALOG_URL || 'http://localhost:8080/api/catalog',
  },
}

module.exports = nextConfig 