const bitcoin = require('bitcoinjs-lib');
const { regtest } = require('bitcoinjs-lib/src/networks');
const ethers = require('ethers');
//import * as bitcoin from 'bitcoinjs-lib';
//import * as btcutils from './lib/utils/BitcoinUtils.js'
//const btcutils = require('./src/utils/BitcoinUtils.ts');
//0 <signature> <pubkey> <<4-byte-fulfillmentId>  <op_drop> <op_dup> <op_hash160> <pubkeyhash-20-byte> <op_equalverify> <op_checksig>>
/*
  witness: 0 <signature> <pubkey> <<4-byte-fulfillmentId>  <op_drop> <op_dup> <op_hash160> <pubkeyhash-20-byte> <op_equalverify> <op_checksig>>
  scriptSig: "",
  scriptPubKey: 0 <32-byte-hash>
*/

const orderId = ethers.utils.keccak256(ethers.utils.solidityPack(
  ["address", "uint256", "uint256", "bytes20", "uint256"],
  ["0xFD05beBFEa081f6902bf9ec57DCb50b40BA02510", 0, 0, '0x0000000000000000000000000000000000000000', 0]
));

console.log(orderId);
const shortOrderId = orderId.slice(2, 10);

let witnessScript = bitcoin.script.compile([
  Buffer.from(shortOrderId, 'hex'),
  bitcoin.opcodes.OP_DROP,
  bitcoin.opcodes.OP_DUP,
  bitcoin.opcodes.OP_HASH160,
  Buffer.from("0000000000000000000000000000000000000000", "hex"),
  bitcoin.opcodes.OP_EQUALVERIFY,
  bitcoin.opcodes.OP_CHECKSIG
]);
   

let witnessScript1 = bitcoin.script.compile([
    Buffer.from(shortOrderId, 'hex'),
    bitcoin.opcodes.OP_DROP,
    bitcoin.opcodes.OP_DUP,
    bitcoin.opcodes.OP_HASH160,
    Buffer.from("0000000000000000000000000000000000000000", 'hex'), // counterparty pubKeyHash
    bitcoin.opcodes.OP_EQUAL,
    bitcoin.opcodes.OP_NOTIF,
    Buffer.from("0fffffff", 'hex'), // populate the future timestamp or future block number here
    bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY,
    bitcoin.opcodes.OP_DROP,
    bitcoin.opcodes.OP_DUP, // should duplicate public key
    bitcoin.opcodes.OP_HASH160,
    Buffer.from("0000000000000000000000000000000000000000", "hex"), // my pub key hash
    bitcoin.opcodes.OP_EQUALVERIFY,
    bitcoin.opcodes.OP_ENDIF,
    bitcoin.opcodes.OP_CHECKSIG,
]);
console.log("Witness Script1: " + witnessScript1.toString('hex'));

const scriptPubKey = ethers.utils.solidityPack(
  ["bytes2", "bytes32"],
  ["0x0020", ethers.utils.sha256(witnessScript)]
);
console.log("Script pub key: " + scriptPubKey);

const scriptPubKey1 = ethers.utils.solidityPack(
  ["bytes2", "bytes32"],
  ["0x0020", ethers.utils.sha256(witnessScript1)]
);
console.log("Script pub key 1: " + scriptPubKey1);

console.log('Witness script:')
console.log(witnessScript.toString('hex'))

const p2wshAddress = bitcoin.payments.p2wsh({redeem: { output: witnessScript }, network: regtest});
console.log(bitcoin.crypto.sha256(witnessScript).toString('hex'));

console.log(p2wshAddress.address);

console.log("witness script0 address", p2wshAddress);
console.log("witness script1 address", bitcoin.payments.p2wsh({redeem: { output: witnessScript1 }}));
//console.log(btcutils.generateTrustlexAddress(Buffer.from("0000000000000000000000000000000000000000", 'hex'), Buffer.from("10000000", 'hex')));

const pubkeys = [
    '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
    '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
    '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
  ].map(hex => Buffer.from(hex, 'hex'));
  //console.log(bitcoin.payments.p2ms({ m: 2, pubkeys }));

  const tx = bitcoin.Transaction.fromBuffer(Buffer.from('02000000000101db6213dfc7d68436bf1bc11721657ab7c0070cd0ceaae62fc44c5f4a11ca9ea70100000000feffffff023fdbf5050000000022512008a19e6792ceab9240cf3baabf044fa8c99eeb98151079598bfce876716aceaf00e1f505000000002200200b8b1b7021edcec7d61512fccf2f8b03c2e5bb813c03cf7a8fd08e93c325d579014089fbc14d0fb92155e88db16b53c32bb7dfd28ec8a7f0dd6ad9419e0357811d63c71e48d9a88b19ac3d7314d1dd0cfeda89ae1f2e484560fe0c40cec1c443fa3e78000000', 'hex'));
  console.log("ok")
  console.log(tx.__toBuffer(undefined, undefined, false).toString('hex'));

  // 0200000001db6213dfc7d68436bf1bc11721657ab7c0070cd0ceaae62fc44c5f4a11ca9ea70100000000feffffff023fdbf5050000000022512008a19e6792ceab9240cf3baabf044fa8c99eeb98151079598bfce876716aceaf00e1f505000000002200200b8b1b7021edcec7d61512fccf2f8b03c2e5bb813c03cf7a8fd08e93c325d579014089fbc14d0fb92155e88db16b53c32bb7dfd28ec8a7f0dd6ad9419e0357811d63c71e48d9a88b19ac3d7314d1dd0cfeda89ae1f2e484560fe0c40cec1c443fa3e78000000
  // 0200000001db6213dfc7d68436bf1bc11721657ab7c0070cd0ceaae62fc44c5f4a11ca9ea70100000000feffffff023fdbf5050000000022512008a19e6792ceab9240cf3baabf044fa8c99eeb98151079598bfce876716aceaf00e1f505000000002200200b8b1b7021edcec7d61512fccf2f8b03c2e5bb813c03cf7a8fd08e93c325d57978000000
