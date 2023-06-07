import { ERC20TokenKey, ERC20TokenLabel } from "~/Context/Constants";

export const ContractMap: any = {
  ETH: {
    // Address of TrustlexPerAssetOrderBook for addOfferWithETH
    address: "0x432d85454a618C4Bd7b6AC084C316007C155480A", //Mumbai
    // address: "0x41b80920255a5c385221AEf56eD7377B1210acC6", //Trustless Network
  },
  [ERC20TokenLabel]: {
    // Address of TrustlexPerAssetOrderBook for addOfferWithToken
    address: "0x86E7a1c97dD7618C86070EbA5dF2bc87CF4a6f46", //Mumbai
    // address: "0xbEB864983Ded627C247b3237E8752D43e9CfeC06", //Trustless Network
  },
};

//Address for sample ERC20 contract
export const ERC20: any = {
  address: "0xa89315E69a8eE3EFbE835736B35aaf265c84B3e1", //Mumbai
  // address: "0x174f05d21c5e45c5AcfeAe2ba967c7af5a1BD8a3", //Trustless Network
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

  // NetworkName: "Ganache Local Test Network",
  // RPC_URL: "http://localhost:8545",
  // ChainID: 1337,
  // ChainIDHexaDecimal: "0x539",
  // CurrencySymbol: "Ganache",
  // ExplorerUrl: "#",

  // NetworkName: "Trustless Remote Test Network",
  // RPC_URL: "http://134.209.22.120:8545",
  // ChainID: 1337,
  // ChainIDHexaDecimal: "0x539",
  // CurrencySymbol: "TRST",
  // ExplorerUrl: "#",
};
