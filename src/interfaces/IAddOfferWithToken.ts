import { BigNumber } from "ethers";

export interface IAddOfferWithToken {
  tokens: number | BigNumber | string;
  satoshis: number | string;
  bitcoinAddress: string;
  offerValidTill: number;
}
