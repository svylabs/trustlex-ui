import express from "express";
import * as tinysecp from "tiny-secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import pkg from "ecpair";
import * as wif from "wif";
import * as bip38 from "bip38";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/generateBitcoinWallet", (req, res) => {
  const ecpair = pkg.ECPairFactory(tinysecp);
  const keypair = ecpair.makeRandom({
    compressed: true,
    network: pkg.networks.bitcoin,
  });

  return res.json({
    privateKey: keypair.privateKey.toString("hex") || Buffer.from(""),
    publicKey: keypair.publicKey.toString("hex"),
    pubkeyHash: bitcoin.crypto.hash160(keypair.publicKey).toString("hex"),
  });
});

app.post("/encryptWallet", (req, res) => {
  const { keyPair, password } = req.body;
  const encryptedKey = bip38.encrypt(keyPair.privateKey, true, password);
  return res.json({
    address: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey }),
    publicKey: keyPair.publicKey.toString("hex"),
    encryptedPrivateKey: encryptedKey,
  });
});

app.post("/decryptWallet", (req, res) => {
  const { walletJSON, password } = req.body;
  const wallet = JSON.parse(walletJSON);
  const decryptedKey = bip38.decrypt(wallet.encryptedPrivateKey, password);
  return res.json({
    privateKey: decryptedKey.privateKey,
    publicKey: Buffer.from(wallet.publicKey, "hex"),
    pubkeyHash: bitcoin.crypto.hash160(Buffer.from(wallet.publicKey, "hex")),
  });
});

app.post("/generateTrustlexAddress", (req, res) => {
  const { pubkeyHash, fulfillmentId } = req.body;

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
  const p2wsh = bitcoin.payments.p2wsh({ redeem: { output: witnessScript } });
  return res.json({
    p2wshAddress: p2wsh.address,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
