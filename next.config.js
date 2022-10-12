/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.moralis.io"],
  },
  env: {
    NEXT_APP_MORALIS_SERVER_URL: "",
    NEXT_APP_MORALIS_APP_ID: "",
  },
};
