export interface IOfferdata {
  offerQuantity: string;
  offeredBy: string;
  offerValidTill: string;
  orderedTime: string;
  offeredBlockNumber: string;
  bitcoinAddress: string;
  satoshisToReceive: string;
  satoshisReceived: string;
  satoshisReserved: string;
  collateralPer3Hours: string;
}

export interface INewOfferEvent {
  from: string;
  to: string;
  value: any;
}
export interface IFullfillmentEvent {
  fulfillmentBy: string;
  quantityRequested: string;
  allowAnyoneToSubmitPaymentProofForFee: boolean;
  allowAnyoneToAddCollateralForFee: boolean;
  totalCollateralAdded: string;
  expiryTime: string;
  fulfilledTime: number | string | Date;
  collateralAddedBy: string;
}
