import * as tinysecp from "tiny-secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import { ECPairFactory, ECPairAPI, networks } from "ecpair";
import * as bip38 from "bip38";
import { BTC_DECIMAL_PLACE, PRODUCTION_MODE } from "~/Context/Constants";
console.log(networks);
export const network =
  PRODUCTION_MODE === true ? networks.bitcoin : networks.testnet;

export interface Wallet {
  privateKey: Buffer;
  publicKey: Buffer;
  pubkeyHash: Buffer;
}

export interface OfflineWallet {
  address: string;
  publicKey: string;
  encryptedPrivateKey: string;
}

export const generateBitcoinWallet = (): Wallet => {
  const ecpair: ECPairAPI = ECPairFactory(tinysecp);
  const keypair = ecpair.makeRandom({
    compressed: true,
    network: network,
  });

  return {
    privateKey: keypair.privateKey || Buffer.from(""),
    publicKey: keypair.publicKey,
    pubkeyHash: bitcoin.crypto.hash160(keypair.publicKey),
  };
};

export const encryptWallet = (keyPair: Wallet, password: string): string => {
  const { bip38_encrypt } = window;
  // const encryptedKey = bip38.encrypt(keyPair.privateKey, true, password);
  // const encryptedKey = window.bip38_encrypt(keyPair.privateKey, true, password);
  console.log(keyPair.privateKey.toString());

  const encryptedKey = bip38_encrypt(keyPair.privateKey, true, password);
  return JSON.stringify({
    address: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey })?.address,
    publicKey: keyPair.publicKey.toString("hex"),
    encryptedPrivateKey: encryptedKey,
  });
};

export const decryptWallet = (walletJSON: string, password: string): Wallet => {
  const wallet = JSON.parse(walletJSON) as OfflineWallet;
  // const decryptedKey = bip38.decrypt(wallet.encryptedPrivateKey, password);
  const decryptedKey = window.bip38_decrypt(
    wallet.encryptedPrivateKey,
    password
  );
  return {
    privateKey: decryptedKey.privateKey,
    publicKey: Buffer.from(wallet.publicKey, "hex"),
    pubkeyHash: bitcoin.crypto.hash160(Buffer.from(wallet.publicKey, "hex")),
  };
};

export const generateTrustlexAddress = (
  pubkeyHash: Buffer,
  fulfillmentId: string
): string | undefined => {
  if (pubkeyHash.length != 20) return undefined;
  const witnessScript = bitcoin.script.compile([
    Buffer.from(fulfillmentId, "hex"),
    bitcoin.opcodes.OP_DROP,
    bitcoin.opcodes.OP_DUP,
    bitcoin.opcodes.OP_HASH160,
    pubkeyHash,
    bitcoin.opcodes.OP_EQUALVERIFY,
    bitcoin.opcodes.OP_CHECKSIG,
  ]);
  const p2wsh = bitcoin.payments.p2wsh({
    redeem: { output: witnessScript, network },
    network,
  });
  return p2wsh.address;
};

export const tofixedBTC = (amount: number) => {
  return Number(amount.toFixed(BTC_DECIMAL_PLACE));
};
