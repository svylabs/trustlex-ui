import React from "react";
import { ethers } from "ethers";

import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
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

export const createContractInstanceWalletService = async (
  contractAddress: string,
  contractABI: string
): Promise<ethers.Contract | false> => {
  try {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    return contract;
  } catch (error) {
    console.log(error);
    return false;
  }
};
