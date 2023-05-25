import { ERC20TokenKey } from "~/Context/Constants";

export const ContractMap: any = {
  ETH: {
    // Address of TrustlexPerAssetOrderBook for addOfferWithETH
    // address: "0x9680BC3a79eE259c81CBab5D381F9b0b2E682cc2", //Mumbai
    address: "0x860b9C22C912045154e43876feA97F4A65757D3E", //Trustless Network
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
  // NetworkName: "Mumbai Polygon Testnet",
  // RPC_URL: "https://matic-mumbai.chainstacklabs.com",
  // ChainID: 80001,
  // ChainIDHexaDecimal: "0x13881",
  // CurrencySymbol: "MATIC",
  // ExplorerUrl: "https://mumbai.polygonscan.com/",

  // NetworkName: "Ganache Local Test Network",
  // RPC_URL: "http://localhost:8545",
  // ChainID: 1337,
  // ChainIDHexaDecimal: "0x539",
  // CurrencySymbol: "Ganache",
  // ExplorerUrl: "#",

  NetworkName: "Trustless Remote Test Network",
  RPC_URL: "http://134.209.22.120:8545",
  ChainID: 1337,
  ChainIDHexaDecimal: "0x539",
  CurrencySymbol: "TRST",
  ExplorerUrl: "#",
};
