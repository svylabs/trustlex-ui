import ImageIcon from "~/components/ImageIcon/ImageIcon";
// SPVC ABI
import erc20ContractABI from "~/files/erc20Contract.json";
import OrderBookETHABI from "~/files/contract.json";
import OrderBookTOKENABI from "~/files/contract.json";

export const PRODUCTION_MODE: boolean = false;

export const MAX_BLOCKS_TO_QUERY = 5000;
export const MAX_ITERATIONS = 14;
export const PAGE_SIZE = 50;
export const TOKEN_DECIMAL_PLACE = 4;
export const OFFER_ORDER_EXPIRY_DIRATION = 3 * 60 * 60; // in seconds
// export const OFFER_ORDER_EXPIRY_DIRATION = 5 * 60; // in seconds
export const BTC_DECIMAL_PLACE = 5;
export const ETH_DECIMAL_PLACE = 5;
export const DEFAULT_COLLETARAL_FEES = 10;

export const ERC20TokenKey = "spvc"; // it should be in lower case
export const ERC20TokenLabel = "SPVC"; // To show in the dropdown
export const ERC20TokenValue = "SPVC";

export const activeExchange = [
  { currency: "btc", value: "" },
  { currency: "eth", value: "" },
  { currency: ERC20TokenKey, value: "" },
];

export const currencyObjects: {
  [key: string]: {
    label: string;
    value: string;
    icon: string | JSX.Element;
    orderBookContractAddreess?: string;
    orderBookContractABI?: any;
    ERC20Address?: string;
    ERC20ABI?: any;
    decimalPlace: Number;
  };
} = {
  eth: {
    label: "ETH", // Please always keep the label  in upper case
    value: "Ethereum",
    icon: <ImageIcon image={"/icons/ethereum-2.svg"} />,
    orderBookContractAddreess: "0x7169B041F4e6E51B10e59Dc8b03F029C7fa658b7",
    orderBookContractABI: OrderBookETHABI.abi,
    decimalPlace: 18,
  },
  btc: {
    label: "BTC",
    value: "bitcoin",
    icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
    decimalPlace: 8,
  },
  [ERC20TokenKey]: {
    label: ERC20TokenLabel,
    value: ERC20TokenValue,
    icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
    orderBookContractAddreess: "0x5df66269f4ddaBcB7fc044AAd00363E8753a8fD4",
    orderBookContractABI: OrderBookTOKENABI.abi,
    ERC20Address: "0xa89315E69a8eE3EFbE835736B35aaf265c84B3e1",
    ERC20ABI: erc20ContractABI.abi,
    decimalPlace: 18,
  },
};
