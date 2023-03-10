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


export interface IListenedOfferData {
  offerEvent: INewOfferEvent;
  offerDetailsInJson: IOfferdata;
}

export interface IOffersResult {
  fromBlock: number;
  toBlock: "latest" | number;
  offers: IListenedOfferData[];
}