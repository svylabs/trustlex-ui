import { IAddOfferWithEth } from "~/interfaces/IAddOfferWithEth";
import abi from "../files/contract.json";
import { ethers } from "ethers";
import { IAddOfferWithToken } from "~/interfaces/IAddOfferWithToken";
import {
  IFullfillmentEvent,
  INewOfferEvent,
  IOfferdata,
} from "~/interfaces/IOfferdata";
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
      console.log(account);
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
export const getBalance = async () => {
  try {
    if (typeof window.ethereum !== undefined) {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const address = `0x5078d53e9347ca2Ee42b6cFfC01C04b69ff9420A`;
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
export const connect = async () => {
  try {
    if (typeof window.ethereum !== undefined) {
      const { ethereum } = window;
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

export const getOffers = async (offerId: any) => {
  try {
    const trustLex = await connect();
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
const listentotheEvent = async () => {
  try {
    const trustLex = await connect();
    if (!trustLex) return false;
    let data = {
      offerEvent: {} as INewOfferEvent,
      offerDetailsInJson: {} as IOfferdata,
    };
    trustLex.on("NEW_OFFER", async (from, to, value) => {
      const offerEvent = {
        from: from.toString(),
        to: to.toString(),
        value: value,
      };

      const offerData = await getOffers(to);
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
    // console.log(newOfferData);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const InitializeFullfillment = async (
  offerId: string,
  _fulfillment: IFullfillmentEvent
) => {
  try {
    const trustLex = await connect();
    if (!trustLex) return false;
    const initializeFullfillment = await trustLex.initiateFulfillment(
      offerId,
      _fulfillment
    );

    console.log("Mining...", initializeFullfillment.hash);
    await initializeFullfillment.wait();
    console.log("Mined -- ", initializeFullfillment.hash);
    return initializeFullfillment;
  } catch (error) {
    console.log(JSON.stringify(error), null, 4);
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
