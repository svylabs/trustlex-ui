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
    actions: {
      cancel: () => {},
      view: () => {},
    },
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
    actions: {
      cancel: () => {},
      view: () => {},
    },
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
    actions: {
      cancel: () => {},
      view: () => {},
    },
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
    actions: {
      cancel: () => {},
      view: () => {},
    },
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
    actions: {
      cancel: () => {},
      view: () => {},
    },
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
