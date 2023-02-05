import { IAddOfferWithEth } from "~/interfaces/IAddOfferWithEth";
import abi from "../files/contract.json";
import { ethers } from "ethers";
import { IAddOfferWithToken } from "~/interfaces/IAddOfferWithToken";
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

const connect = async () => {
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
      return trustLex;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const getOffers = async () => {
  try {
    const trustLex = await connect();
    if (!trustLex) return false;

    let offers = await trustLex.offers(0);
    let tokenContract = await trustLex.tokenContract();
    // const off = JSON.stringify(offers);
    console.log("Offers", offers);
    console.log("TokenContracts", tokenContract);
  } catch (error) {
    console.log(error);
  }
};

export const AddOfferWithEth = async (data: IAddOfferWithEth) => {
  const { satoshis, bitcoinAddress, offerValidTill } = data;

  try {
    const trustLex = await connect();
    if (!trustLex) return false;
    const addOffer = await trustLex.addOfferWithEth(
      satoshis,
      bitcoinAddress,
      offerValidTill
    );
    console.log("Mining...", addOffer.hash);
    await addOffer.wait();
    console.log("Mined -- ", addOffer.hash);
    return addOffer;
  } catch (error) {
    console.log(error);
  }
};

export const AddOfferWithToken = async (data: IAddOfferWithToken) => {
  try {
    const trustLex = await connect();
    if (!trustLex) return false;
    const addOffer = await trustLex.addOfferWithToken(
      data.value,
      data.satoshis,
      data.bitcoinAddress,
      data.offerValidTill
    );
    console.log("Mining...", addOffer.hash);
    await addOffer.wait();
    console.log("Mined -- ", addOffer.hash);
    return addOffer;
  } catch (error) {
    console.log(error);
  }
};
