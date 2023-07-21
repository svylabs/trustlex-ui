export enum BitcoinNodeEnum {
  TrustlexNode = "Trustlex Node",
  // LocalNode = "Local Node",
}

export interface IBitcoinPaymentProof {
  transaction: string; // transaction
  proof: string; // concatnation of transactions inside of block but skip first transaction
  index: Number; //
  blockHeight: Number; //Height of the block
}

export interface HTLCDetail {
  secret: String;
  recoveryPubKeyHash: String;
}
