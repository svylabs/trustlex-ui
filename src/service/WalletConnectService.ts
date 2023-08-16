import React from "react";
import { ethers } from "ethers";
import { showErrorMessage, showSuccessMessage } from "~/service/AppService";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { fetchBlockNumber } from "wagmi/actions";
import { watchContractEvent } from "@wagmi/core";

import { type PublicClient, getPublicClient } from "@wagmi/core";
import { providers } from "ethers";
import { type HttpTransport } from "viem";
import { type WalletClient } from "@wagmi/core";
import { useContractEvent } from "wagmi";

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

const chains = [polygon];
const projectId = "f651a9b7ead78bc8fba3196e06188f4b";

// Rename provider to ethereum
export const ethereum = await EthereumProvider.init({
  projectId: projectId, // REQUIRED your projectId
  chains: [80001], // REQUIRED chain ids
  optionalChains: [], // OPTIONAL chains
  showQrModal: true, // REQUIRED set to "true" to use @walletconnect/modal
  methods: [
    "eth_requestAccounts",
    "eth_signTypedData",
    "eth_signTypedData_v4",
    "eth_sign",
  ], // REQUIRED ethereum methods
  optionalMethods: [], // OPTIONAL ethereum methods
  events: [
    "chainChanged",
    "accountsChanged",
    "connect",
    "session_event",
    "display_uri",
    "disconnect",
  ], // REQUIRED ethereum events
  optionalEvents: [], // OPTIONAL ethereum events
  // rpcMap, // OPTIONAL rpc urls for each chain
  // metadata, // OPTIONAL metadata of your app
  qrModalOptions: {
    themeMode: "dark",
    privacyPolicyUrl: "https://example.com/privacy-policy",
    termsOfServiceUrl: "https://example.com/terms-and-conditions",
    explorerRecommendedWalletIds: "NONE",
  }, // OPTIONAL - `undefined` by default, see https://docs.walletconnect.com/2.0/web3modal/options
});

export const provider = new ethers.providers.Web3Provider(ethereum);

export const getConnectedAccount = async () => {
  try {
    let result = await ethereum.enable();
    // console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
};
const handler = (event: any, data: any) => {
  console.log(event);
};

// chain changed
ethereum.on("chainChanged", (data) => handler("chainChanged", data));
// accounts changed
ethereum.on("accountsChanged", (data) => handler("accountsChanged", data));
// session established
ethereum.on("connect", (data) => handler("connect", data));
// session event - chainChanged/accountsChanged/custom events
ethereum.on("session_event", (data) => handler("session_event", data));
// connection uri
ethereum.on("display_uri", (data) => handler("display_uri", data));
// session disconnect
ethereum.on("disconnect", (data) => handler("disconnect", data));

export const getBalance = async () => {
  try {
    let address = "0xf72b8291b10ec381e55de4788f6ebbb7425cf34e";

    const signer = provider.getSigner();
    // let balance: any = await provider.getBalance(address);
    // console.log(balance.toString(), provider, signer);

    let balance: any = await provider.getBalance(address);
    balance = +ethers.utils.formatEther(balance);
    console.log(balance);
    return balance;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const getERC20TokenBalance = async (
  address: string,
  contractAddress: string,
  contractABI: string
): Promise<number> => {
  try {
    const signer = provider.getSigner();
    const erc20TokenContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    let balance = await erc20TokenContract.balanceOf(address);
    balance = +ethers.utils.formatEther(balance);
    return balance;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

// export const createContractInstanceWalletService = async (
//   contractAddress: string,
//   contractABI: string
// ): Promise<ethers.Contract | false> => {
//   try {
//     const signer = provider.getSigner();
//     const contract = new ethers.Contract(contractAddress, contractABI, signer);

//     return contract;
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// };
//----------------------------- Start Wagmi library functions --------------------------------//
// export function publicClientToProvider(publicClient: PublicClient) {
//   const { chain, transport } = publicClient;
//   const network = {
//     chainId: chain.id,
//     name: chain.name,
//     ensAddress: chain.contracts?.ensRegistry?.address,
//   };
//   if (transport.type === "fallback")
//     return new providers.FallbackProvider(
//       (transport.transports as ReturnType<HttpTransport>[]).map(
//         ({ value }) => new providers.JsonRpcProvider(value?.url, network)
//       )
//     );
//   return new providers.JsonRpcProvider(transport.url, network);
// }

// /** Action to convert a viem Public Client to an ethers.js Provider. */
// export function getEthersProvider({ chainId }: { chainId?: number } = {}) {
//   const publicClient = getPublicClient({ chainId });
//   return publicClientToProvider(publicClient);
// }

// export function walletClientToSigner(walletClient: WalletClient) {
//   const { account, chain, transport } = walletClient;
//   const network = {
//     chainId: chain.id,
//     name: chain.name,
//     ensAddress: chain.contracts?.ensRegistry?.address,
//   };
//   const provider = new providers.Web3Provider(transport, network);
//   const signer = provider.getSigner(account.address);
//   return signer;
// }

// /** Action to convert a viem Wallet Client to an ethers.js Signer. */
// export async function getEthersSigner({ chainId }: { chainId?: number } = {}) {
//   const walletClient = await getWalletClient({ chainId });
//   if (!walletClient) return undefined;
//   return walletClientToSigner(walletClient);
// }

export const createContractInstanceWagmi = async (
  contractAddress: any,
  contractABI: any
) => {
  try {
    const walletClient = await getWalletClient();

    const contract = getContract({
      address: contractAddress,
      abi: contractABI,
      walletClient: walletClient,
    });

    return contract;
  } catch (error) {
    console.log(error);
    return false;
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

    const unwatch = watchContractEvent(
      {
        address: contractAddress,
        abi: contractABI,
        eventName: "SETTLEMENT_SUCCESSFUL",
      },
      (log) => console.log(log)
    );
    return 0;
    console.log(unwatch);
    const data = await readContract({
      address: contractAddress,
      abi: contractABI,
      eventName: "SETTLEMENT_SUCCESSFUL",
    });
    console.log(data);
    let total_quantityRequested = 0;

    if (receivedByAddress != "") {
      PAYMENT_SUCCESSFUL_EVENTS = PAYMENT_SUCCESSFUL_EVENTS.filter(
        (value: any, index: number) => {
          let args: any = value.args;
          let receivedBy = args.receivedBy;
          // console.log("receivedBy", receivedBy);
          return receivedBy.toLowerCase() == receivedByAddress.toLowerCase();
        }
      );
    }
    // console.log(PAYMENT_SUCCESSFUL_EVENTS);
    PAYMENT_SUCCESSFUL_EVENTS.map(async (value, index) => {
      let args: any = value.args;
      // let fulfillmentId = args.fulfillmentId.toString();
      let offerId = args.offerId.toString();
      let submittedBy = args.submittedBy;
      let receivedBy = args.receivedBy;
      let txHash = args.txHash;
      let outputHash = args.outputHash;

      let compactFulfillmentDetail = BigInt(args.compactSettlementDetail);
      let fulfillmentId = Number(compactFulfillmentDetail >> BigInt(8 * 8));
      let quantityRequested = Number(
        compactFulfillmentDetail & ((BigInt(1) << BigInt(8 * 8)) - BigInt(1))
      );
      total_quantityRequested += quantityRequested;
    });

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
