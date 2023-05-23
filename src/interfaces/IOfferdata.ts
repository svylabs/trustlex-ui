export interface IOfferdata {
  offerId: string;
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
  progress: string;
  offerType: string;
  fullfillmentRequestId: undefined;
  fulfillmentRequests?: IFullfillmentEvent;
  fulfillmentRequestExpiryTime?: string;
  fulfillmentRequestQuantityRequested?: string;
  fullfillmentResults?: IFullfillmentResult;
}

export interface INewOfferEvent {
  from: string;
  to: string;
}

export interface IInitilizedFullfillmentEvent {
  claimedBy: string;
  offerId: string;
  fulfillmentId: string;
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
  paymentProofSubmitted: boolean;
}

export interface IFullfillmentResult {
  fulfillmentRequest: IFullfillmentEvent;
  fulfillmentRequestId: string;
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

export interface IOffersResultByNonEvent {
  offers: IListenedOfferData[];
}
export interface IListInitiatedFullfillmentData {
  offerEvent: IInitilizedFullfillmentEvent;
  offerDetailsInJson: IOfferdata;
  offersFullfillmentJson: IFullfillmentEvent;
}

export interface IListInitiatedFullfillmentDataByNonEvent {
  offerDetailsInJson: IOfferdata;
}
export interface IinitiatedFullfillmentResult {
  fromBlock: number;
  toBlock: "latest" | number;
  offers: IListInitiatedFullfillmentData[];
}

export enum OrderBy {
  ASC = "asc",
  DESC = "desc",
}
