import abi from "../files/contract.json";
import { ethers } from "ethers";
const getEthereumObject = () => window.ethereum;

export const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();
    if (!ethereum || ethereum.request === undefined) {
      return false;
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      return account;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const connectToMetamask = async () => {
  try {
    const ethereum = getEthereumObject();
    if (!ethereum || ethereum.request === undefined) {
      alert("Get MetaMast!");
      return false;
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    return accounts[0];
  } catch (error) {
    return false;
  }
};

export const getOffers = async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const trustLex = new ethers.Contract(
        `0x5078d53e9347ca2Ee42b6cFfC01C04b69ff9420A`,
        abi.abi,
        signer
      );
      // let count = await trustLex.offers(0);
      let count = await trustLex.tokenContract();

      console.log(count);
    } else {
      console.log("Ethereum object doesn't exists!");
    }
  } catch (error) {
    console.log(error);
  }
};
