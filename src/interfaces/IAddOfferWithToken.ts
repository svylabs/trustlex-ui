import { BigNumber } from "ethers";

export interface IAddOfferWithToken {
  value: number | BigNumber | string;
  satoshis: number | string;
  bitcoinAddress: string;
  offerValidTill: number;
}
