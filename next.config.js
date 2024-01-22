/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  transpilePackages: ["@zerodev", "@web3"],
}

module.exports = nextConfig
