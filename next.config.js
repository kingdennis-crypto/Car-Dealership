/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: 'http://127.0.0.1:3000',
    BLOCKCHAIN_ADDRESS: 'http://127.0.0.1:7545',
    DEALERSHIP_CONTRACT: '0xaf8Ef7331CaC5C996aC65a54f3bbbB459A80c975',
  },
  images: {
    domains: ['gateway.ipfscdn.io'],
  },
}

module.exports = nextConfig
