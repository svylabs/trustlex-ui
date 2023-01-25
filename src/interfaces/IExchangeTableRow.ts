import { CurrencyEnum } from "~/enums/CurrencyEnum";
import { IPlanning } from "./IPlanning";

export interface IExchangeTableRow {
  orderNumber: string | number;
  planningToSell: IPlanning;
  planningToBuy: IPlanning;
  rateInBTC: number;
  leftToBuy: {
    left: number;
    total: number;
    type: CurrencyEnum;
  };
  validFor: string;
  date: Date;
}
