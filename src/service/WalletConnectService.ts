import React from "react";
import { ethers } from "ethers";
import { showErrorMessage, showSuccessMessage } from "~/service/AppService";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { fetchBlockNumber } from "wagmi/actions";
import { watchContractEvent } from "@wagmi/core";

import {
  getContract,
  writeContract,
  readContract,
  fetchBalance,
  getWalletClient,
} from "@wagmi/core";
const { EthDater }: any = window;
import moment from "moment";
import { tofixedBTC } from "~/utils/BitcoinUtils";

//----------------------------- Start Wagmi library functions --------------------------------//

export const createContractInstanceWagmi = async (
  contractAddress: any,
  contractABI: any
) => {
  try {
    const walletClient: any = await getWalletClient();

    const contract = getContract({
      address: contractAddress,
      abi: contractABI,
      walletClient: walletClient,
    });

    return contract;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
export const createContractInstanceWalletService = async (
  ethereum: any,
  contractAddress: string,
  contractABI: string
): Promise<ethers.Contract | false> => {
  try {
    if (typeof ethereum !== undefined) {
      console.log(ethereum);
      const provider = new ethers.providers.Web3Provider(ethereum);

      const signer = provider.getSigner();
      console.log(signer);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      return contract;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const writeContractWagmi = async (
  contractAddress: any,
  contractABI: any,
  functionName: string,
  args: any,
  value: string = ""
) => {
  try {
    let inputData: any = {
      address: contractAddress,
      abi: contractABI,
      functionName: functionName,
      args: args,
    };
    if (value) {
      inputData["value"] = value;
    }
    const result = await writeContract(inputData);
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const readContractWagmi = async (
  contractAddress: any,
  contractABI: any,
  functionName: string,
  args: []
) => {
  try {
    const data = await readContract({
      address: contractAddress,
      abi: contractABI,
      functionName: functionName,
      args: args,
    });
    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const fetchBalanceWagmi = async (address: any, unit: string = "wei") => {
  try {
    const data = await fetchBalance({ address: address });
    if (unit == "eth") {
      return Number(data.formatted);
    } else {
      return Number(data.value);
    }
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const getEventDataWagmi = async (
  ContractInstance: ethers.Contract,
  fromLastHours: number = 0,
  receivedByAddress: string = "",
  ethereumObject: any,
  contractAddress: string = "",
  contractABI: any = ""
) => {
  try {
    // console.log(fromLastHours, receivedByAddress);
    // if (typeof ethereumObject !== undefined) {
    // const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereumObject);
    let toBlock: any = await fetchBlockNumber();
    toBlock = Number(toBlock);
    console.log(toBlock);
    // Getting block by date:
    const dater = new EthDater(
      provider // Ethers provider, required.
    );

    let estimatedFromBlock = 0;
    if (fromLastHours != 0) {
      let dateFrom = moment().subtract(fromLastHours, "h").format();
      let block = await dater.getDate(
        dateFrom, //"2016-07-20T13:20:40Z", // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
        true, // Block after, optional. Search for the nearest block before or after the given date. By default true.
        false // Refresh boundaries, optional. Recheck the latest block before request. By default false.
      );

      estimatedFromBlock = block.block;
    }
    console.log(estimatedFromBlock);
    console.log(ContractInstance);
    // estimatedFromBlock = Number(toBlock) - 50000;
    // let PAYMENT_SUCCESSFUL_EVENTS = await ContractInstance.queryFilter(
    //   "SETTLEMENT_SUCCESSFUL",
    //   estimatedFromBlock,
    //   toBlock
    // );

    // const unwatch = watchContractEvent(
    //   {
    //     address: contractAddress,
    //     abi: contractABI,
    //     eventName: "SETTLEMENT_SUCCESSFUL",
    //   },
    //   (log) => console.log(log)
    // );
    // return 0;
    // console.log(unwatch);
    // const data = await readContract({
    //   address: contractAddress,
    //   abi: contractABI,
    //   eventName: "SETTLEMENT_SUCCESSFUL",
    // });
    // console.log(data);
    let total_quantityRequested = 0;

    // if (receivedByAddress != "") {
    //   PAYMENT_SUCCESSFUL_EVENTS = PAYMENT_SUCCESSFUL_EVENTS.filter(
    //     (value: any, index: number) => {
    //       let args: any = value.args;
    //       let receivedBy = args.receivedBy;
    //       // console.log("receivedBy", receivedBy);
    //       return receivedBy.toLowerCase() == receivedByAddress.toLowerCase();
    //     }
    //   );
    // }
    // // console.log(PAYMENT_SUCCESSFUL_EVENTS);
    // PAYMENT_SUCCESSFUL_EVENTS.map(async (value, index) => {
    //   let args: any = value.args;
    //   // let fulfillmentId = args.fulfillmentId.toString();
    //   let offerId = args.offerId.toString();
    //   let submittedBy = args.submittedBy;
    //   let receivedBy = args.receivedBy;
    //   let txHash = args.txHash;
    //   let outputHash = args.outputHash;

    //   let compactFulfillmentDetail = BigInt(args.compactSettlementDetail);
    //   let fulfillmentId = Number(compactFulfillmentDetail >> BigInt(8 * 8));
    //   let quantityRequested = Number(
    //     compactFulfillmentDetail & ((BigInt(1) << BigInt(8 * 8)) - BigInt(1))
    //   );
    //   total_quantityRequested += quantityRequested;
    // });

    // Converting satoshi to Btc
    total_quantityRequested = Number(
      tofixedBTC(total_quantityRequested / 10 ** 8)
    );
    // console.log(total_quantityRequested);
    return total_quantityRequested;
  } catch (err) {
    console.log(err);
    return 0;
  }
};

export const watchContractEventWagmi = async (
  contractAddress: any,
  contractABI: any
) => {
  try {
    const unwatch = watchContractEvent(
      {
        address: contractAddress,
        abi: contractABI,
        eventName: "SETTLEMENT_SUCCESSFUL",
      },
      (log) => console.log(log)
    );
    console.log(unwatch);
  } catch (error) {
    console.log(error);
    return false;
  }
};
