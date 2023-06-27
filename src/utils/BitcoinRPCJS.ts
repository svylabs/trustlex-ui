// import bitcore from "bitcore";
// import RpcClient from "bitcoind-rpc";

// //   var config = 'http://user:pass@127.0.0.1:18332';
// var config =
//   "http://admin:54dbafeb6d6cfe0547232588add8929e$5f87b341887b15ebc8dc6bae3727191eede833578df877bc1757666e7356901f@134.209.22.120:18443/";
// var rpc = new RpcClient(config);

// import Client from "bitcoin-core";
// const options = {
//   port: 18443,
//   host: "http://134.209.22.120",
//   network: "regtest",
// };
// const client = new Client(options);

import { RPCClient } from "./client";

export const showNewTransactions = async function () {
  //   console.log(RPCClient);
  let result = await RPCClient.createWallet("dcs");
  //   console.log(result);
  //   client.getInfo().then((help: any) => console.log(help));
  console.log("Working fine.");
};
