import * as tinysecp from "tiny-secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import { ECPairFactory, ECPairAPI, networks } from "ecpair";
import * as bip32 from "bip32";
import { BTC_DECIMAL_PLACE, PRODUCTION_MODE } from "~/Context/Constants";

export const network =
  PRODUCTION_MODE === true ? networks.bitcoin : networks.testnet;

export interface Wallet {
  privateKey: Buffer;
  publicKey: Buffer;
  pubkeyHash: Buffer;
  extendedPublicKeyRecovery: string;
  extendedPublicKeySecret: string;
}

export interface IBTCWallet {
  publicKey: string;
  pubkeyHash: string;
  extendedPublicKeyRecovery: string;
  extendedPublicKeySecret: string;
}

export interface OfflineWallet {
  address: string;
  publicKey: string;
  encryptedPrivateKey: string;
  extendedPublicKeyRecovery: string;
  extendedPublicKeySecret: string;
}

export const generateBitcoinWallet = (): Wallet => {
  const ecpair: ECPairAPI = ECPairFactory(tinysecp);
  const keypair = ecpair.makeRandom({
    compressed: true,
    network: network,
  });
  const hdwallet = bip32.BIP32Factory(tinysecp);
  const node = hdwallet.fromSeed(keypair.privateKey || Buffer.from(""));
  const extendedPublicKeyRecovery = node.derivePath("m/84'/120'/0'/0");
  const extendedPublicKeySecret = node.derivePath("m/84'/121'/0'/0");
  return {
    privateKey: keypair.privateKey || Buffer.from(""),
    publicKey: keypair.publicKey,
    pubkeyHash: bitcoin.crypto.hash160(keypair.publicKey),
    extendedPublicKeyRecovery: extendedPublicKeyRecovery.neutered().toBase58(),
    extendedPublicKeySecret: extendedPublicKeySecret.neutered().toBase58(),
  };
};

export const encryptWallet = (keyPair: Wallet, password: string): string => {
  const { bip38_encrypt } = window;
  // const encryptedKey = bip38.encrypt(keyPair.privateKey, true, password);
  // const encryptedKey = window.bip38_encrypt(keyPair.privateKey, true, password);
  // console.log(keyPair.privateKey.toString());

  const encryptedKey = bip38_encrypt(keyPair.privateKey, true, password);
  return JSON.stringify({
    // address: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey })?.address,
    address: generateTrustlexAddress(keyPair.pubkeyHash, "10"),
    publicKey: keyPair.publicKey.toString("hex"),
    pubkeyHash: keyPair.pubkeyHash.toString("hex"),
    encryptedPrivateKey: encryptedKey,
    extendedPublicKeyRecovery: keyPair.extendedPublicKeyRecovery,
    extendedPublicKeySecret: keyPair.extendedPublicKeySecret,
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
    extendedPublicKeyRecovery: wallet.extendedPublicKeyRecovery,
    extendedPublicKeySecret: wallet.extendedPublicKeySecret,
  };
};

export const generateTrustlexAddress = (
  pubkeyHash: Buffer,
  // fulfillmentId: string
  shortOrderId: string
): string | undefined => {
  if (pubkeyHash.length != 20) return undefined;
  const witnessScript = bitcoin.script.compile([
    // Buffer.from(fulfillmentId, "hex"),
    Buffer.from(shortOrderId, "hex"),
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

export const generateSecret = (input: Buffer) => {
  let secret = bitcoin.crypto.hash256(input);
  return secret;
};

export const getHashedSecret = (secret: Buffer) => {
  let hashedSecret = bitcoin.crypto.hash256(secret);
  return hashedSecret;
};
export const generateTrustlexAddressWithRecoveryHash = (
  pubkeyHash: Buffer,
  shortOrderId: string,
  secret: Buffer,
  pubKeyHashSender: string,
  locktime: number
): string | undefined => {
  if (pubkeyHash.length != 20) return undefined;
  let hashedSecret = bitcoin.crypto.hash256(secret);

  let witnessScript2 = bitcoin.script.compile([
    Buffer.from(shortOrderId, "hex"),
    bitcoin.opcodes.OP_DROP,
    bitcoin.opcodes.OP_DUP,
    bitcoin.opcodes.OP_HASH160,
    pubkeyHash, // Same as the pubKeyHash that was used before
    bitcoin.opcodes.OP_EQUAL,
    bitcoin.opcodes.OP_IF,
    bitcoin.opcodes.OP_SWAP,
    bitcoin.opcodes.OP_HASH256,
    hashedSecret, // Dynamic value -  need to generate a secret = bitcoin.crypto.hash256(publicKey + shortOrderId), hashedSecret = bitcoin.crypto.hash256(secret)
    bitcoin.opcodes.OP_EQUALVERIFY,
    bitcoin.opcodes.OP_ELSE,
    bitcoin.script.number.encode(locktime), // locktime value should be a number based on initiated block timestamp + 7 days in seconds.
    bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY,
    bitcoin.opcodes.OP_DROP,
    bitcoin.opcodes.OP_DUP,
    bitcoin.opcodes.OP_HASH160,
    Buffer.from(pubKeyHashSender, "hex"), // Recovery pubKeyHash
    bitcoin.opcodes.OP_EQUALVERIFY,
    bitcoin.opcodes.OP_ENDIF,
    bitcoin.opcodes.OP_CHECKSIG,
  ]);

  const p2wsh = bitcoin.payments.p2wsh({
    redeem: { output: witnessScript2, network },
    network,
  });
  return p2wsh.address;
};

export const tofixedBTC = (amount: number) => {
  return Number(amount.toFixed(BTC_DECIMAL_PLACE));
};

export const deriveRecoveryPubKeyHash = (
  extendedPubKey: string,
  orderId: number
): Buffer => {
  const hdwallet = bip32.BIP32Factory(tinysecp);
  const node = hdwallet.fromBase58(extendedPubKey);
  const child = node.derive(orderId);
  return child.identifier;
};

export const deriveSecret = (
  extendedPubKey: string,
  orderId: number
): Buffer => {
  const hdwallet = bip32.BIP32Factory(tinysecp);
  const node = hdwallet.fromBase58(extendedPubKey);
  const child = node.derive(orderId);
  return bitcoin.crypto.sha256(child.publicKey);
};
