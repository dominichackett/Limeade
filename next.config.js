/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.moralis.io","ipfs.nftstorage.link"],
  },
  env: {
    NEXT_APP_MORALIS_SERVER_URL: "",
    NEXT_APP_MORALIS_APP_ID: "",
    NEXT_PUBLIC_COVALENT_KEY: "ckey_28e144556c844a9cbf7d252abbf",

  },
};
