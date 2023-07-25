import { BitcoinNodeEnum } from "~/interfaces/IBitcoinNode";
import React from "react";
import axios from "axios";
import {
  TrustlexBitcoinNodeApiKey,
  PRODUCTION_MODE,
  BITCOIN_MAINNET_API_URL,
  BITCOIN_TESTNET_API_URL,
  BITCOIN_MAINNET_RPC_URL,
  BITCOIN_TESTNET_RPC_URL,
} from "~/Context/Constants";
import { stringify } from "querystring";

export const GetTransactionDetails = async (
  selectedBitcoinNode: string,
  transactionHash: string,
  recieverAddress: string,
  paymentAmount: number
) => {
  let resp: {
    status: boolean;
    message: string;
    result: string;
  };
  try {
    let API_END_POINT = PRODUCTION_MODE
      ? BITCOIN_MAINNET_API_URL
      : BITCOIN_TESTNET_API_URL;
    transactionHash = transactionHash + ".json";
    //   let transactionHash =
    //     "f4defa29eb33caaab3e5bb9c62fe659b3676da8a55c554984f766455a4e4c877.json";
    //   let recieverAddress = "tb1qpad47g0nnswks2sr4zn2c987c8q9f7ykyh7d9j";
    //   let paymentAmount = 0.01637724;

    if (selectedBitcoinNode == BitcoinNodeEnum.TrustlexNode) {
      let options = {
        // `headers` are custom headers to be sent
        headers: { "x-api-key": TrustlexBitcoinNodeApiKey },
      };
      let url = `${API_END_POINT}rest/tx/${transactionHash}`;

      let data = await axios.get(url, options);

      let tx: any = data.data;
      console.log(data.data);
      let isRecieverAddessMatched = tx?.vout?.find((value: any) => {
        let address: string = value.scriptPubKey.address;
        let paidAmount = value.value;
        return (
          address.toLowerCase() === recieverAddress.toLowerCase() &&
          paidAmount >= paymentAmount
        );
      });

      if (isRecieverAddessMatched) {
        let transactionHex = tx.hex;

        resp = {
          status: true,
          message: "",
          result: transactionHex,
        };
      } else {
        resp = {
          status: false,
          message:
            "Either reciever address is  wrong or paid amount is not matched.",
          result: "",
        };
      }
      return resp;
    }
  } catch (err) {
    resp = {
      status: false,
      message: "Transaction is not found on the network",
      result: "",
    };
    console.log(err);
    return resp;
  }
};

// Sample post request
export const PostRequest = async () => {
  let newfiles = "newfiles";

  let formData = new FormData();

  // Adding files to the formdata
  formData.append("image", newfiles);
  formData.append("name", "Name");

  axios({
    // Endpoint to send files
    url: "http://localhost:8080/files",
    method: "POST",
    headers: {
      // Add any auth token here
      authorization: "your token comes here",
    },

    // Attaching the form data
    data: formData,
  })
    // Handle the response from backend here
    .then((res) => {})

    // Catch errors if any
    .catch((err) => {});
};

// GetRawTransaction RPC Method
export const GetRawTransaction = async (
  selectedBitcoinNode: string,
  transactionHash: string
) => {
  let resp: {
    status: boolean;
    message: string;
    result: string;
  };
  try {
    let API_END_POINT = PRODUCTION_MODE
      ? BITCOIN_MAINNET_RPC_URL
      : BITCOIN_TESTNET_RPC_URL;
    transactionHash = transactionHash;

    if (selectedBitcoinNode == BitcoinNodeEnum.TrustlexNode) {
      let url = `${API_END_POINT}`;
      // console.log(url);
      let data = await axios({
        // Endpoint to send files
        url: url,
        method: "POST",
        headers: {
          // Add any auth token here
          "Content-Type": "application/json",
        },

        // Attaching the form data
        data: {
          jsonrpc: "1.0",
          id: "curltext",
          method: "getrawtransaction",
          params: [transactionHash],
        },
      });

      let tx: any = data.data;
      // console.log(tx);
      resp = {
        status: true,
        message: "",
        result: tx.result,
      };

      return resp;
    }
  } catch (err) {
    resp = {
      status: false,
      message: "Transaction is not found on the network",
      result: "",
    };
    console.log(err);
    return resp;
  }
};

// GetRawTransaction RPC Method
export const DecodeRawTransaction = async (
  selectedBitcoinNode: string,
  transactionHashHex: string
) => {
  let resp: {
    status: boolean;
    message: string;
    result: string;
  };
  try {
    let API_END_POINT = PRODUCTION_MODE
      ? BITCOIN_MAINNET_RPC_URL
      : BITCOIN_TESTNET_RPC_URL;

    if (selectedBitcoinNode == BitcoinNodeEnum.TrustlexNode) {
      let url = `${API_END_POINT}`;
      // console.log(url);
      let data = await axios({
        // Endpoint to send files
        url: url,
        method: "POST",
        headers: {
          // Add any auth token here
          "Content-Type": "application/json",
        },

        // Attaching the form data
        data: {
          jsonrpc: "1.0",
          id: "curltext",
          method: "decoderawtransaction",
          params: [transactionHashHex],
        },
      });

      let tx: any = data.data;
      // console.log(tx);
      resp = {
        status: true,
        message: "",
        result: tx,
      };

      return resp;
    }
  } catch (err) {
    resp = {
      status: false,
      message: "Transaction is not found on the network",
      result: "",
    };
    console.log(err);
    return resp;
  }
};

// GetRawTransaction RPC Method
export const VerifyTransaction = async (
  selectedBitcoinNode: string,
  transactionHash: string,
  recieverAddress: string,
  paymentAmount: number
) => {
  let resp: {
    status: boolean;
    message: string;
    result: string;
  };
  try {
    let result = await GetRawTransaction(selectedBitcoinNode, transactionHash);
    if (result?.status == false) {
      resp = {
        status: false,
        message: result.message,
        result: "",
      };
      return resp;
    }
    let transactionHex = result?.result as string;

    let decodedTransaction = await DecodeRawTransaction(
      selectedBitcoinNode,
      transactionHex
    );
    if (decodedTransaction?.status == false) {
      resp = {
        status: false,
        message: decodedTransaction?.message,
        result: "",
      };
      return resp;
    }
    let tx: any = decodedTransaction?.result;
    tx = tx?.result;
    // console.log(tx);

    let isRecieverAddessMatched = tx?.vout?.find((value: any) => {
      let address: string = value.scriptPubKey.address;
      let paidAmount = value.value;

      return (
        address.toLowerCase() === recieverAddress.toLowerCase() &&
        paidAmount >= paymentAmount
      );
    });

    if (isRecieverAddessMatched) {
      resp = {
        status: true,
        message: "",
        result: transactionHex,
      };
    } else {
      resp = {
        status: false,
        message:
          "Either reciever address is  wrong or paid amount is not matched.",
        result: "",
      };
    }
    return resp;
  } catch (err) {
    resp = {
      status: false,
      message: "Transaction is not found on the network",
      result: "",
    };
    console.log(err);
    return resp;
  }
};

// GetBlock RPC Method
export const GetBlock = async (
  selectedBitcoinNode: string,
  blockHash: string
) => {
  let resp: {
    status: boolean;
    message: string;
    result: string;
  };
  try {
    let API_END_POINT = PRODUCTION_MODE
      ? BITCOIN_MAINNET_RPC_URL
      : BITCOIN_TESTNET_RPC_URL;

    if (selectedBitcoinNode == BitcoinNodeEnum.TrustlexNode) {
      let url = `${API_END_POINT}`;
      // console.log(url);
      let data = await axios({
        // Endpoint to send files
        url: url,
        method: "POST",
        headers: {
          // Add any auth token here
          "Content-Type": "application/json",
        },

        // Attaching the form data
        data: {
          jsonrpc: "1.0",
          id: "curltext",
          method: "getblock",
          params: [blockHash],
        },
      });

      let tx: any = data.data;
      // console.log(tx);
      resp = {
        status: true,
        message: "",
        result: tx.result,
      };

      return resp;
    }
  } catch (err) {
    resp = {
      status: false,
      message: "Block is not found on the network",
      result: "",
    };
    console.log(err);
    return resp;
  }
};
