import { IAddOfferWithEth } from "~/interfaces/IAddOfferWithEth";
import abi from "../files/contract.json";
import { Wallet, ethers } from "ethers";
import { IAddOfferWithToken } from "~/interfaces/IAddOfferWithToken";
import {
  IFullfillmentEvent,
  IListenedOfferData,
  INewOfferEvent,
  IOfferdata,
} from "~/interfaces/IOfferdata";
import axios from "axios";
import { MAX_BLOCKS_TO_QUERY, MAX_ITERATIONS } from "~/Context/Constants";
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
export const getBalance = async (address: string) => {
  try {
    if (typeof window.ethereum !== undefined) {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const balance = await provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

// export const convertEthtoBitcoin = async (ethAmount: number) => {
//   try {
//     const ETH_DECIMALS = 18;
//     const BTC_DECIMALS = 8;
//     const ETH_BTC_RATIO = 200;

//     if (typeof window.ethereum !== undefined) {
//       const { ethereum } = window;
//       const provider = new ethers.providers.Web3Provider(ethereum);
//       const ethPrice = await provider.getGasPrice();
//       const btcPrice = await provider.getGasPrice();

//       const ethInWei = ethAmount * 10 ** ETH_DECIMALS;
//       const btcInSatoshi = ethInWei * ETH_BTC_RATIO;
//       const btcAmount = btcInSatoshi / 10 ** BTC_DECIMALS;
//       return btcAmount;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     return false;
//   }
// };
export const connect = async (
  provider: ethers.providers.Web3Provider,
  address: string,
  callback?: Function
) => {
  try {
    if (typeof window.ethereum !== undefined) {
      let accounts = await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();
      const trustLex = new ethers.Contract(address, abi.abi, signer);
      return trustLex;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const getOffers = async (
  trustLex: ethers.Contract | undefined,
  offerId: any
) => {
  try {
    if (!trustLex) return false;

    let offerData = await trustLex.offers(offerId);
    // let tokenContract = await trustLex.tokenContract();

    // console.log("TokenContracts", tokenContract);

    return offerData;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const AddOfferWithEth = async (
  trustLex: ethers.Contract | undefined,
  data: IAddOfferWithEth
) => {
  const { satoshis, bitcoinAddress, offerValidTill } = data;

  try {
    if (!trustLex) return false;
    console.log(trustLex);
    const addOffer = await trustLex.addOfferWithEth(
      satoshis,
      "0x" + bitcoinAddress,
      offerValidTill
    );
    await addOffer.wait();
    return addOffer;
  } catch (error) {
    console.log(error);
  }
};
export const listOffers = async (
  trustLex: ethers.Contract | undefined,
  fromBlock: number = 0,
  toBlock: "latest" | number = "latest"
) => {
  try {
    if (!trustLex || toBlock == -1)
      return { fromBlock: fromBlock, toBlock: toBlock, offers: [] };
    let estimatedFromBlock = fromBlock;
    if (toBlock === "latest") {
      toBlock = await trustLex.provider.getBlockNumber();
      estimatedFromBlock = Math.max(0, toBlock - MAX_BLOCKS_TO_QUERY);
    } else if (toBlock > 0) {
      estimatedFromBlock = Math.max(fromBlock, toBlock - MAX_BLOCKS_TO_QUERY);
    }
    const offers: IListenedOfferData[] = [];
    let iterations = 0;
    do {
      estimatedFromBlock = Math.max(fromBlock, estimatedFromBlock - MAX_BLOCKS_TO_QUERY);
      const offersSubSet = await trustLex.queryFilter("NEW_OFFER", estimatedFromBlock, estimatedFromBlock + MAX_BLOCKS_TO_QUERY);
      const promises = offersSubSet.map(async (offer) => {
        const offerEvent = {
          from: offer.args ? offer.args[0] : "",
          to: offer.args ? offer.args[1] : "",
        };

        const offerData = await getOffers(trustLex, offerEvent.to);
        const offerDetailsInJson = {
          offerQuantity: offerData[0].toString(),
          offeredBy: offerData[1].toString(),
          offerValidTill: offerData[2].toString(),
          orderedTime: offerData[3].toString(),
          offeredBlockNumber: offerData[4].toString(),
          bitcoinAddress: offerData[5].toString(),
          satoshisToReceive: offerData[6].toString(),
          satoshisReceived: offerData[7].toString(),
          satoshisReserved: offerData[8].toString(),
          collateralPer3Hours: offerData[9].toString(),
        };
        return { offerEvent, offerDetailsInJson };
      });
      const offersList: IListenedOfferData[] = await Promise.all(promises);
      offersList.forEach((o) => {
        offers.push(o);
      })
      iterations++;
    } while (estimatedFromBlock > fromBlock && iterations < MAX_ITERATIONS);
    return {
      fromBlock: fromBlock,
      toBlock: toBlock,
      offers: offers,
    };
    /*
    offers.forEach((offer) => {
      console.log(offer);
      const offerEvent = {
        from: "",
        to:  "",
        value: "",
      };

      const offerData = await getOffers(trustLex, offerEvent.to);
      const offerDetailsInJson = {
        offerQuantity: offerData[0].toString(),
        offeredBy: offerData[1].toString(),
        offerValidTill: offerData[2].toString(),
        orderedTime: offerData[3].toString(),
        offeredBlockNumber: offerData[4].toString(),
        bitcoinAddress: offerData[5].toString(),
        satoshisToReceive: offerData[6].toString(),
        satoshisReceived: offerData[7].toString(),
        satoshisReserved: offerData[8].toString(),
        collateralPer3Hours: offerData[9].toString(),
      };
      return { offerEvent, offerDetailsInJson };
      */

    //});
    // console.log(newOfferData);
  } catch (error) {
    console.log(error);
    return { offers: [], fromBlock, toBlock };
  }
};

export const InitializeFullfillment = async (
  trustLex: ethers.Contract | undefined,
  offerId: string,
  _fulfillment: IFullfillmentEvent
) => {
  try {
    if (!trustLex) return false;
    const initializeFullfillment = await trustLex.initiateFulfillment(
      offerId,
      _fulfillment
    );

    await initializeFullfillment.wait();
    return initializeFullfillment;
  } catch (error) {
    console.log(JSON.stringify(error), null, 4);
  }
};

export const AddOfferWithToken = async (
  trustLex: ethers.Contract | undefined,
  data: IAddOfferWithToken
) => {
  try {
    if (!trustLex) return false;
    const addOffer = await trustLex.addOfferWithToken(
      data.value,
      data.satoshis,
      data.bitcoinAddress,
      data.offerValidTill
    );
    await addOffer.wait();
    return addOffer;
  } catch (error) {
    console.log(error);
  }
};
