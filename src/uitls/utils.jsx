import axios from "axios"
const NFTAddress = '0xc741854f35ECCC6631621e2aabaE973d049Fb2A4'


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
  
  