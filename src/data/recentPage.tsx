import { CurrencyEnum } from "~/enums/CurrencyEnum";
import { StatusEnum } from "~/enums/StatusEnum";
export const OngoingTableData = [
  {
    orderNumber: 123444,
    planningToSell: {
      amount: 10,
      type: CurrencyEnum.ETH,
    },
    planningToBuy: {
      amount: 0.078,
      type: CurrencyEnum.BTC,
    },
    rateInBTC: 0.078,
    progress: "Initiated 35m ago",
    offerType: "my_offer",
    fullfillmentRequestId: undefined,
    offerId: 0,
  },
  {
    orderNumber: 123444,
    planningToSell: {
      amount: 10,
      type: CurrencyEnum.ETH,
    },
    planningToBuy: {
      amount: 0.078,
      type: CurrencyEnum.BTC,
    },
    rateInBTC: 0.078,
    progress: "Submit Proof of payment",
    offerType: "my_offer",
    fullfillmentRequestId: undefined,
    offerId: 0,
  },
  {
    orderNumber: 123444,
    planningToSell: {
      amount: 10,
      type: CurrencyEnum.ETH,
    },
    planningToBuy: {
      amount: 0.078,
      type: CurrencyEnum.BTC,
    },
    rateInBTC: 0.078,
    progress: "95% filled",
    offerType: "my_offer",
    fullfillmentRequestId: undefined,
    offerId: 0,
  },
  {
    orderNumber: 123444,
    planningToSell: {
      amount: 10,
      type: CurrencyEnum.ETH,
    },
    planningToBuy: {
      amount: 0.078,
      type: CurrencyEnum.BTC,
    },
    rateInBTC: 0.078,
    progress: "92% filled",
    offerType: "my_offer",
    fullfillmentRequestId: undefined,
    offerId: 0,
  },
  {
    orderNumber: 123444,
    planningToSell: {
      amount: 10,
      type: CurrencyEnum.ETH,
    },
    planningToBuy: {
      amount: 0.078,
      type: CurrencyEnum.BTC,
    },
    rateInBTC: 0.078,
    progress: "Submit Proof of payment",
    offerType: "my_offer",
    fullfillmentRequestId: undefined,
    offerId: 0,
  },
];
export const HistoryTableData = [
  {
    orderNumber: 123444,
    planningToSell: {
      amount: 10,
      type: CurrencyEnum.ETH,
    },
    planningToBuy: {
      amount: 0.078,
      type: CurrencyEnum.BTC,
    },
    rateInBTC: 0.078,
    date: "09 Jan, 13:45pm",
    status: StatusEnum.Completed,
  },
  {
    orderNumber: 123444,
    planningToSell: {
      amount: 10,
      type: CurrencyEnum.ETH,
    },
    planningToBuy: {
      amount: 0.078,
      type: CurrencyEnum.BTC,
    },
    rateInBTC: 0.078,
    date: "09 Jan, 13:45pm",
    status: StatusEnum.Completed,
  },
  {
    orderNumber: 123444,
    planningToSell: {
      amount: 10,
      type: CurrencyEnum.ETH,
    },
    planningToBuy: {
      amount: 0.078,
      type: CurrencyEnum.BTC,
    },
    rateInBTC: 0.078,
    date: "09 Jan, 13:45pm",
    status: StatusEnum.Completed,
  },
  {
    orderNumber: 123444,
    planningToSell: {
      amount: 10,
      type: CurrencyEnum.ETH,
    },
    planningToBuy: {
      amount: 0.078,
      type: CurrencyEnum.BTC,
    },
    rateInBTC: 0.078,
    date: "09 Jan, 13:45pm",
    status: StatusEnum.Completed,
  },
  {
    orderNumber: 123444,
    planningToSell: {
      amount: 10,
      type: CurrencyEnum.ETH,
    },
    planningToBuy: {
      amount: 0.078,
      type: CurrencyEnum.BTC,
    },
    rateInBTC: 0.078,
    date: "09 Jan, 13:45pm",
    status: StatusEnum.Completed,
  },
];

export const viewOrderDrawerHistoryTableData = [
  {
    orderNumber: 123444,
    planningToSell: {
      amount: 10,
      type: CurrencyEnum.ETH,
    },
    planningToBuy: {
      amount: 0.078,
      type: CurrencyEnum.BTC,
    },
    date: "Initiated 30min ago",
  },
  {
    orderNumber: 123444,
    planningToSell: {
      amount: 10,
      type: CurrencyEnum.ETH,
    },
    planningToBuy: {
      amount: 0.078,
      type: CurrencyEnum.BTC,
    },
    date: "Completed on 09 Jan, 2023",
  },
  {
    orderNumber: 123444,
    planningToSell: {
      amount: 10,
      type: CurrencyEnum.ETH,
    },
    planningToBuy: {
      amount: 0.078,
      type: CurrencyEnum.BTC,
    },
    date: "Completed on 09 Jan, 2023",
  },
];
