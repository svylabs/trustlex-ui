import { ERC20TokenKey } from "~/Context/Constants";

export const ContractMap: any = {
  ETH: {
    // Address of TrustlexPerAssetOrderBook for addOfferWithETH
    address: "0x0fBF408d8180a763E5d9B7EfEf143703845B3521",
  },
  Token: {
    // Address of TrustlexPerAssetOrderBook for addOfferWithToken
    address: "0x97ed9e3bD0B8c219B21d5Efe7E61CA8240b78940",
  },
};

//Address for sample ERC20 contract
export const ERC20: any = {
  address: "0x1cE30Fdb52ceb9BB1E2232cfBF17e57845F053C8",
};

//Address for sample ERC20 contract
export const BlockchainExplorerLink: any = "https://mumbai.polygonscan.com/tx/";

export const NetworkInfo = {
  NetworkName: "Mumbai Polygon Testnet",
  RPC_URL: "https://matic-mumbai.chainstacklabs.com",
  ChainID: 80001,
  ChainIDHexaDecimal: "0x13881",
  CurrencySymbol: "MATIC",
  ExplorerUrl: "https://mumbai.polygonscan.com/",
};
