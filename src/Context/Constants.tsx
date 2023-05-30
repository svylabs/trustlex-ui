import ImageIcon from "~/components/ImageIcon/ImageIcon";

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
  };
} = {
  eth: {
    label: "ETH", // Please always keep the label  in upper case
    value: "Ethereum",
    icon: <ImageIcon image={"/icons/ethereum-2.svg"} />,
  },
  btc: {
    label: "BTC",
    value: "bitcoin",
    icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
  },
  [ERC20TokenKey]: {
    label: ERC20TokenLabel,
    value: ERC20TokenValue,
    icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
  },
};
