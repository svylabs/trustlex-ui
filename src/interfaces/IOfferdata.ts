export interface IOfferdata {
  offerId: string;
  offerQuantity: string;
  offeredBy: string;
  offerValidTill: string;
  orderedTime: string;
  offeredBlockNumber: string;
  pubKeyHash: string;
  satoshisToReceive: string;
  satoshisReceived: string;
  satoshisReserved: string;
  progress?: string;
  offerType?: string;
  fullfillmentRequestId?: string | undefined;
  settlementRequests: [];
  fulfillmentRequestExpiryTime?: string;
  fulfillmentRequestQuantityRequested?: string;
  fulfillmentRequestSettled?: boolean;
  fulfillmentRequestfulfilledTime?: any;
  settlementRequestResults?: IResultSettlementRequest[];
  isCanceled: boolean;
}

export interface IResultOffer {
  offerId: string;
  offer: IOfferdata;
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

// No longer will be in used
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
  isExpired: boolean;
  fulfillRequestedTime: number;
}
export interface SettlementRequest {
  settledBy: string;
  quantityRequested: string;
  settlementRequestedTime: number;
  expiryTime?: string;
  settledTime?: number;
  lockTime: number;
  recoveryPubKeyHash: string;
  settled?: boolean;
  isExpired?: boolean;
  txId?: string;
  scriptOutputHash?: string;
  hashedSecret: string;
}

export interface IResultSettlementRequest {
  settlementRequest: SettlementRequest;
  settlementRequestId: string;
}
export interface IInitiatedOrder {
  accountAddress: string;
  offerId: string;
  ethAmount: string;
  txHash: string;
  blockHash: string;
}

export interface IFullfillmentResult {
  fulfillmentRequest: IFullfillmentEvent;
  fulfillmentRequestId: string;
}

export interface IListenedOfferData {
  // offerEvent: INewOfferEvent;
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
