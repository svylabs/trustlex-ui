import ImageIcon from "~/components/ImageIcon/ImageIcon";

export const exchangeTableCols = [
  "# of order",
  "Selling",
  "Asking",
  "Price in BTC",
  "Left to buy",
  "Offer valid for",
  "Order date",
];
export const exchangeMobileTableCols = ["# of order", "Date", "More options"];

export const minCollateral = [
  {
    label: "0%",
    value: "0",
  },
  {
    label: "5%",
    value: "5",
  },
  {
    label: "10%",
    value: "10",
  },
  {
    label: "15%",
    value: "15",
  },
  {
    label: "20%",
    value: "20",
  },
];

export const offerValidity = [
  // {
  //   label: "5 hours",
  //   value: "5hrs",
  // },
  // {
  //   label: "10 hours",
  //   value: "10hrs",
  // },
  {
    label: "1 day",
    value: "1d",
  },
  {
    label: "2 days",
    value: "2d",
  },
  {
    label: "1 Week",
    value: "1w",
  },
];

export const data1 = [
  {
    value: "btc",
    label: "BTC",
    icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
  },
];

export const data2 = [
  {
    label: "Limit",
    value: "limit",
  },
  {
    label: "No Limit",
    value: "no-limit",
  },
];

export const data3 = [
  {
    value: "eth",
    label: "ETH",
    icon: <ImageIcon image={"/icons/ethereum-2.svg"} />,
  },
  {
    value: "solana",
    label: "SOL",
    icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
  },
];

// export const tableData: IExchangeTableRow[] = [
//   {
//     orderNumber: 1211,
//     planningToSell: {
//       amount: 10,
//       type: CurrencyEnum.ETH,
//     },
//     planningToBuy: {
//       amount: 0.078,
//       type: CurrencyEnum.BTC,
//     },
//     rateInBTC: 0.078,
//     leftToBuy: {
//       left: 1,
//       total: 10,
//       type: CurrencyEnum.ETH,
//     },
//     validFor: "1h",
//     date: new Date(),
//   },
// ];
