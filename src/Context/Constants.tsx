import ImageIcon from "~/components/ImageIcon/ImageIcon";
// SPVC ABI
import erc20ContractABI from "~/files/erc20Contract.json";
import OrderBookETHABI from "~/files/orderBookETHContract.json";
import OrderBookTOKENABI from "~/files/contract.json";

export const PRODUCTION_MODE: boolean = false;

export const MAX_BLOCKS_TO_QUERY = 5000;
export const MAX_ITERATIONS = 14;
export const PAGE_SIZE = 50;
export const TOKEN_DECIMAL_PLACE = 4;
export const OFFER_ORDER_EXPIRY_DIRATION = 3 * 60 * 60; // in seconds
// export const OFFER_ORDER_EXPIRY_DIRATION = 5 * 60; // in seconds
export const BTC_DECIMAL_PLACE = 8;
export const ETH_DECIMAL_PLACE = 8;
export const DEFAULT_COLLETARAL_FEES = 10;

export const ERC20TokenKey = "spvc"; // it should be in lower case
export const ERC20TokenLabel = "SPVC"; // To show in the dropdown
export const ERC20TokenValue = "SPVC";

export const TrustlexBitcoinNodeApiKey = "d924a382-ab7c-4649-b4eb-0f731b9a100e";
export const BITCOIN_MAINNET_API_URL = "https://btc.getblock.io/mainnet/";
export const BITCOIN_TESTNET_API_URL = "https://btc.getblock.io/testnet/";

export const BITCOIN_MAINNET_RPC_URL = `https://btc.getblock.io/${TrustlexBitcoinNodeApiKey}/mainnet/`;
export const BITCOIN_TESTNET_RPC_URL = `https://btc.getblock.io/${TrustlexBitcoinNodeApiKey}/testnet/`;

//Contracts  Deployed on Polygon Mumbai mainnet for chain link price feed
const priceFeedContractAddress = {
  btc: "0xc907E116054Ad103354f2D350FD2514433D57F6f", // BTC / USD
  eth: "0xF9680D99D6C9589e2a93a78A04A279e509205945", // ETH / USD
  matic: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0", // Matic / USD
  usdt: "0x0A6513e40db6EB1b165753AD52E80663aeA50545", // USDT / USD
  bnb: "0x82a6c4AF830caa6c97bb504425f6A66165C2c26e", // BNB / USD
};
//Contracts  Deployed on Polygon Mumbai testnet for chain link price feed
const priceFeedContractAddressTestnet = {
  btc: "0x007A22900a3B98143368Bd5906f8E17e9867581b", // BTC / USD
  eth: "0x0715A7794a1dc8e42615F059dD6e406A6594651A", // ETH / USD
  matic: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada", // Matic / USD
  usdt: "0x92C09849638959196E976289418e5973CC96d645", // USDT / USD
  bnb: "0x0715A7794a1dc8e42615F059dD6e406A6594651A", // BNB / USD
};

// Networks List
export const networks = [
  { networkKey: "polygon_matic" },
  // { networkKey: "trustlex_testnet" },
  { networkKey: "ganache_testnet" },
  { networkKey: "bnb_testnet" },
];

// Default Network
export const DEFAULT_NETWORK = "polygon_matic";
export const DEFAULT_TOKEN = "matic".toUpperCase(); // It should be in upper case
export const DEFAULT_IS_NATIVE_TOKEN = true;

// Networks details Object
export const NetworkInfo: {
  [key: string]: {
    NetworkName: string;
    RPC_URL: string;
    ChainID: number;
    ChainIDHexaDecimal: string;
    CurrencySymbol: string;
    ExplorerUrl: null | string;
  };
} = {
  polygon_matic: {
    NetworkName: "Mumbai Polygon Testnet",
    RPC_URL: "https://matic-mumbai.chainstacklabs.com",
    ChainID: 80001,
    ChainIDHexaDecimal: "0x13881",
    CurrencySymbol: "MATIC",
    ExplorerUrl: "https://mumbai.polygonscan.com/",
  },
  trustlex_testnet: {
    NetworkName: "Trustless Remote Test Network",
    RPC_URL: "https://134.209.22.120:8545",
    ChainID: 1337,
    ChainIDHexaDecimal: "0x539",
    CurrencySymbol: "TRST",
    ExplorerUrl: null,
  },
  ganache_testnet: {
    NetworkName: "Ganache Local Test Network",
    RPC_URL: "http://localhost:8545",
    ChainID: 1337,
    ChainIDHexaDecimal: "0x539",
    CurrencySymbol: "Ganache",
    ExplorerUrl: null,
  },
  bnb_testnet: {
    NetworkName: "BNB Smart Chain Testnet",
    RPC_URL: "https://data-seed-prebsc-1-s3.binance.org:8545/",
    ChainID: 97,
    ChainIDHexaDecimal: "0x61",
    CurrencySymbol: "tBNB",
    ExplorerUrl: "https://testnet.bscscan.com/",
  },
};

export const activeExchange = [
  {
    currency: "btc",
    value: "",
    networkName: "",
    networkKey: "",
    isEthereumCahin: false,
    isNativeToken: true,
  },

  /* Start Currencies for Polygon Testnet Matic */
  {
    currency: "matic",
    value: "",
    networkName: "Polygon Testnet Matic",
    networkKey: "polygon_matic",
    isEthereumCahin: true,
    isNativeToken: true,
  },
  {
    currency: ERC20TokenKey,
    value: "",
    networkName: "Polygon Testnet Matic",
    networkKey: "polygon_matic",
    isEthereumCahin: true,
    isNativeToken: false,
  },
  /* End Currencies for Polygon Testnet Matic */
  /* Start Currencies for Trustlex Testnet */
  {
    currency: "eth",
    value: "",
    networkName: "Trustlex Testnet",
    networkKey: "trustlex_testnet",
    isEthereumCahin: true,
    isNativeToken: true,
  },
  {
    currency: ERC20TokenKey,
    value: "",
    networkName: "Trustlex Testnet",
    networkKey: "trustlex_testnet",
    isEthereumCahin: true,
    isNativeToken: false,
  },
  /* End Currencies for Trustlex Testnet */
  /* Start Currencies for Ganache Testnet */
  {
    currency: "eth",
    value: "",
    networkName: "Ganache Testnet",
    networkKey: "ganache_testnet",
    isEthereumCahin: true,
    isNativeToken: true,
  },
  {
    currency: ERC20TokenKey,
    value: "",
    networkName: "Ganache Testnet",
    networkKey: "ganache_testnet",
    isEthereumCahin: true,
    isNativeToken: false,
  },
  /* End Currencies for Ganache Testnet */
  /* Start Currencies for Ganache Testnet */
  {
    currency: "tbnb",
    value: "",
    networkName: "BNB Testnet",
    networkKey: "bnb_testnet",
    isEthereumCahin: true,
    isNativeToken: true,
  },
  // {
  //   currency: ERC20TokenKey,
  //   value: "",
  //   networkName: "BNB Testnet",
  //   networkKey: "bnb_testnet",

  // isEthereumCahin: true,
  // isNativeToken:false,
  // },
  /* End Currencies for Ganache Testnet */
];

export const currencyObjects: {
  [network: string]: {
    // network should be in lower case
    [key: string]: {
      // key should be in lower case
      label: string;
      value: string;
      icon: string | JSX.Element;
      orderBookContractAddreess?: string;
      TrustedBitcoinSPVChainContractAddress?: string;
      orderBookContractABI?: any;
      ERC20Address?: string;
      ERC20ABI?: any;
      decimalPlace: Number;
      isNativeToken: boolean;
      priceRateContractAddress: string;
    };
  };
} = {
  polygon_matic: {
    btc: {
      label: "BTC",
      value: "bitcoin",
      icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
      decimalPlace: 8,
      isNativeToken: true,
      priceRateContractAddress:
        Boolean(PRODUCTION_MODE) === true
          ? priceFeedContractAddress.btc
          : priceFeedContractAddressTestnet.btc,
    },
    matic: {
      label: "Matic", // Please always keep the label  in upper case
      value: "Matic",
      icon: <ImageIcon image={"/icons/matic-token.png"} />,
      orderBookContractAddreess: "0xbfeebe28E5ba5Ea5EB681099211c2052588f329d",
      TrustedBitcoinSPVChainContractAddress:
        "0xF3FB2d78CE5C9b1BFe5249110e6B084bB19f6be3",
      orderBookContractABI: OrderBookETHABI.abi,
      decimalPlace: 18,
      isNativeToken: true,
      priceRateContractAddress:
        Boolean(PRODUCTION_MODE) === true
          ? priceFeedContractAddress.matic
          : priceFeedContractAddressTestnet.matic,
    },

    [ERC20TokenKey]: {
      label: ERC20TokenLabel,
      value: ERC20TokenValue,
      icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
      orderBookContractAddreess: "0x86E7a1c97dD7618C86070EbA5dF2bc87CF4a6f46",
      TrustedBitcoinSPVChainContractAddress:
        "0xbf143e49CB94daaffb973342B23b762553505d19",
      orderBookContractABI: OrderBookTOKENABI.abi,
      ERC20Address: "0xa89315E69a8eE3EFbE835736B35aaf265c84B3e1",
      ERC20ABI: erc20ContractABI.abi,
      decimalPlace: 18,
      isNativeToken: false,
      priceRateContractAddress:
        Boolean(PRODUCTION_MODE) === true
          ? priceFeedContractAddress.usdt
          : priceFeedContractAddressTestnet.usdt,
    },
  },
  trustlex_testnet: {
    btc: {
      label: "BTC",
      value: "bitcoin",
      icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
      decimalPlace: 8,
      isNativeToken: true,
      priceRateContractAddress:
        Boolean(PRODUCTION_MODE) === true
          ? priceFeedContractAddress.btc
          : priceFeedContractAddressTestnet.btc,
    },
    eth: {
      label: "ETH", // Please always keep the label  in upper case
      value: "Ethereum",
      icon: <ImageIcon image={"/icons/ethereum-2.svg"} />,
      orderBookContractAddreess: "0x43ef4e21Ec14B83A25D8fCa2670FF4B20F82e1c0",
      TrustedBitcoinSPVChainContractAddress:
        "0xbf143e49CB94daaffb973342B23b762553505d19",
      orderBookContractABI: OrderBookETHABI.abi,
      decimalPlace: 18,
      isNativeToken: true,
      priceRateContractAddress:
        Boolean(PRODUCTION_MODE) === true
          ? priceFeedContractAddress.eth
          : priceFeedContractAddressTestnet.eth,
    },

    [ERC20TokenKey]: {
      label: ERC20TokenLabel,
      value: ERC20TokenValue,
      icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
      orderBookContractAddreess: "0x66396A87A0e3c2Bd547E9fA37Accc2ABf56AA306",
      TrustedBitcoinSPVChainContractAddress:
        "0xbf143e49CB94daaffb973342B23b762553505d19",
      orderBookContractABI: OrderBookTOKENABI.abi,
      ERC20Address: "0x2671497b1DfE57200883C5f5151AF5492B623835",
      ERC20ABI: erc20ContractABI.abi,
      decimalPlace: 18,
      isNativeToken: false,
      priceRateContractAddress:
        Boolean(PRODUCTION_MODE) === true
          ? priceFeedContractAddress.usdt
          : priceFeedContractAddressTestnet.usdt,
    },
  },
  ganache_testnet: {
    btc: {
      label: "BTC",
      value: "bitcoin",
      icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
      decimalPlace: 8,
      isNativeToken: true,
      priceRateContractAddress:
        Boolean(PRODUCTION_MODE) === true
          ? priceFeedContractAddress.btc
          : priceFeedContractAddressTestnet.btc,
    },
    eth: {
      label: "ETH", // Please always keep the label  in upper case
      value: "Ethereum",
      icon: <ImageIcon image={"/icons/ethereum-2.svg"} />,
      orderBookContractAddreess: "0xAFD95b8eD2834B6FdF7a7a09C9Fb4657459A1F9d",
      TrustedBitcoinSPVChainContractAddress:
        "0x4231992EB17B6f4295afEBF2A099AB8Df582F60b",
      orderBookContractABI: OrderBookETHABI.abi,
      decimalPlace: 18,
      isNativeToken: true,
      priceRateContractAddress:
        Boolean(PRODUCTION_MODE) === true
          ? priceFeedContractAddress.eth
          : priceFeedContractAddressTestnet.eth,
    },
    [ERC20TokenKey]: {
      label: ERC20TokenLabel,
      value: ERC20TokenValue,
      icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
      orderBookContractAddreess: "0x86E7a1c97dD7618C86070EbA5dF2bc87CF4a6f46",
      TrustedBitcoinSPVChainContractAddress:
        "0xbf143e49CB94daaffb973342B23b762553505d19",
      orderBookContractABI: OrderBookTOKENABI.abi,
      ERC20Address: "0xa89315E69a8eE3EFbE835736B35aaf265c84B3e1",
      ERC20ABI: erc20ContractABI.abi,
      decimalPlace: 18,
      isNativeToken: false,
      priceRateContractAddress:
        Boolean(PRODUCTION_MODE) === true
          ? priceFeedContractAddress.usdt
          : priceFeedContractAddressTestnet.usdt,
    },
  },
  bnb_testnet: {
    btc: {
      label: "BTC",
      value: "bitcoin",
      icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
      decimalPlace: 8,
      isNativeToken: true,
      priceRateContractAddress:
        Boolean(PRODUCTION_MODE) === true
          ? priceFeedContractAddress.btc
          : priceFeedContractAddressTestnet.btc,
    },
    tbnb: {
      label: "tBNB", // Please always keep the label  in upper case
      value: "tBNB",
      icon: <ImageIcon image={"/icons/bnb.png"} />,
      orderBookContractAddreess: "0x27e7b02c4032ac81301b64725ff730e1734f1df2",
      TrustedBitcoinSPVChainContractAddress:
        "0xbf143e49CB94daaffb973342B23b762553505d19",
      orderBookContractABI: OrderBookETHABI.abi,
      decimalPlace: 18,
      isNativeToken: true,
      priceRateContractAddress:
        Boolean(PRODUCTION_MODE) === true
          ? priceFeedContractAddress.bnb
          : priceFeedContractAddressTestnet.bnb,
    },

    // [ERC20TokenKey]: {
    //   label: ERC20TokenLabel,
    //   value: ERC20TokenValue,
    //   icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
    //   orderBookContractAddreess: "0x86E7a1c97dD7618C86070EbA5dF2bc87CF4a6f46",
    //   orderBookContractABI: OrderBookTOKENABI.abi,
    //   ERC20Address: "0xa89315E69a8eE3EFbE835736B35aaf265c84B3e1",
    //   ERC20ABI: erc20ContractABI.abi,
    //   decimalPlace: 18,
    // isNativeToken: false,
    // },
  },
};
