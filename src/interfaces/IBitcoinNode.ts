export enum BitcoinNodeEnum {
  TrustlexNode = "Trustlex Node",
  // LocalNode = "Local Node",
}

export interface IBitcoinPaymentProof {
  transactionHex: String; //Hex of the transaction
  proof: String; // concatnation of transactions inside of block but skip first transaction
  index: Number; //
  blockHeight: Number; //Height of the block
}
