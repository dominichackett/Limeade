import axios from "axios"
import { USDCAddress } from "../Components/Contracts/USDCContract";
const NFTAddress = '0xc741854f35ECCC6631621e2aabaE973d049Fb2A4'
const UniswapPositionNFT = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'


export const tokenMetadata = async ( tokenId) => {
    let data;
    await axios
      .get(
        `https://api.covalenthq.com/v1/80001/tokens/${NFTAddress}/nft_metadata/${tokenId}/`,
        {
          params: {
            "quote-currency": "USD",
            format: "JSON",
            key: `${process.env.NEXT_PUBLIC_COVALENT_KEY}`,
          },
        }
      )
      .then((tokens) => {
        if (tokens.data.data.items[0]?.nft_data != undefined)
          data = {
            address: tokens.data.data.items[0].contract_address,
            symbol: tokens.data.data.items[0].contract_ticker_symbol,
            tokenId: tokenId,
            name: tokens.data.data.items[0].contract_name,
            metadata: tokens.data.data.items[0]?.nft_data[0]?.external_data,
          };
      });
  
    return data;
  };
  
  export const getUniswapPositionNFT = async (walletAddress) => {
    let data = [];
    await axios
      .get(
        `https://api.covalenthq.com/v1/80001/address/${walletAddress}/balances_v2/`,
        {
          timeout: 50000,
          params: {
            "quote-currency": "USD",
            format: "JSON",
            key: `${process.env.NEXT_PUBLIC_COVALENT_KEY}`,
            nft: true,
            "no-nft-fetch": false,
          },
        }
      )
      .then((tokens) => {
        console.log({ tokens });
        tokens.data.data.items.forEach((token) => {
          if (token.contract_address == UniswapPositionNFT.toLowerCase())
            data.push(token);
          console.log(token.contract_address);
        });
        // data = tokens.data.data.items;
      });
  
    return data;
  };



  export const getUSDCBalance = async (walletAddress) => {
    let data = [];
    await axios
      .get(
        `https://api.covalenthq.com/v1/80001/address/${walletAddress}/balances_v2/`,
        {
          timeout: 50000,
          params: {
            "quote-currency": "USD",
            format: "JSON",
            key: `${process.env.NEXT_PUBLIC_COVALENT_KEY}`,
            nft: true,
            "no-nft-fetch": true,
          },
        }
      )
      .then((tokens) => {
        console.log({ tokens });
        tokens.data.data.items.forEach((token) => {
          if (token.contract_address == USDCAddress.toLowerCase())
            data.push(token);
          console.log(token.contract_address);
        });
        // data = tokens.data.data.items;
      });
  
    return data;
  };