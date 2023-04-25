import { IAddOfferWithEth } from "~/interfaces/IAddOfferWithEth";
import abi from "../files/contract.json";
import { Wallet, ethers } from "ethers";
import { IAddOfferWithToken } from "~/interfaces/IAddOfferWithToken";
import {
  IFullfillmentEvent,
  IListenedOfferData,
  INewOfferEvent,
  IOfferdata,
  IinitiatedFullfillmentResult,
  IListInitiatedFullfillmentData,
  IOffersResultByNonEvent,
} from "~/interfaces/IOfferdata";
import axios from "axios";
import { PAGE_SIZE } from "~/Context/Constants";
import { MAX_BLOCKS_TO_QUERY, MAX_ITERATIONS } from "~/Context/Constants";
import { EthtoWei, WeitoEth } from "~/utils/Ether.utills";

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
      alert("Get MetaMask!");
      return false;
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    return accounts[0];
  } catch (error) {
    console.log(error);
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

export const getTotalOffers = async (trustLex: ethers.Contract | undefined) => {
  try {
    if (!trustLex) return false;

    let offerData = await trustLex.getTotalOffers();
    return offerData.toString();
  } catch (error) {
    console.log(error);
    return;
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
  const { weieth, satoshis, bitcoinAddress, offerValidTill } = data;

  try {
    if (!trustLex) return false;
    // Get the ETH account
    const account = await connectToMetamask();
    // Get the ETH balance
    const EthBalance = await getBalance(account);
    const userInputEth = WeitoEth(weieth);

    if (userInputEth > EthBalance) {
      alert("Your ETH balance is low !");
      throw new Error("Your ETH balance is low !");
    }

    const addOffer = await trustLex.addOfferWithEth(
      weieth,
      satoshis,
      "0x" + bitcoinAddress,
      offerValidTill,
      { value: weieth }
    );
    await addOffer.wait();
    return addOffer;
  } catch (error) {
    console.log(error);
  }
};

// new function to fetch the list of offers
// export const getOffersList = async (
//   trustLex: ethers.Contract | undefined,
//   offset: number,
//   limit: number,
//   OrderByData: OrderBy
// ) => {
//   try {
//     if (!trustLex) {
//       console.log("trustLex is not defined", trustLex);
//       return <IOffersResultByNonEvent>{ totalOffers: 0, offers: [] };
//     }
//     console.log(offset, limit);
//     let TotalOffers = await trustLex.getTotalOffers();
//     TotalOffers = TotalOffers.toString();

//     const promises = [];
//     for (
//       let i = OrderByData == OrderBy.ASC ? offset : offset - 1;
//       OrderByData == OrderBy.ASC
//         ? i < limit && i < TotalOffers
//         : i >= offset - limit && i >= 0;
//       OrderByData == OrderBy.ASC ? i++ : i--
//     ) {
//       // console.log(i);
//       const offerData = await getOffers(trustLex, i);
//       const offerDetailsInJson = {
//         offerId: i.toString(),
//         offerQuantity: offerData[0].toString(),
//         offeredBy: offerData[1].toString(),
//         offerValidTill: offerData[2].toString(),
//         orderedTime: offerData[3].toString(),
//         offeredBlockNumber: offerData[4].toString(),
//         bitcoinAddress: offerData[5].toString(),
//         satoshisToReceive: offerData[6].toString(),
//         satoshisReceived: offerData[7].toString(),
//         satoshisReserved: offerData[8].toString(),
//         collateralPer3Hours: offerData[9].toString(),
//       };
//       promises.push({ offerDetailsInJson });
//     }
//     const offersList = await Promise.all(promises);
//     return <IOffersResultByNonEvent>{
//       totalOffers: TotalOffers,
//       offers: offersList,
//     };
//   } catch (error) {
//     console.log(error);
//     return <IOffersResultByNonEvent>{ totalOffers: 0, offers: [] };
//   }
// };

// new function to fetch the list of offers

export const getOffersList = async (
  trustLex: ethers.Contract | undefined,
  fromOfferId: number
) => {
  try {
    if (!trustLex) {
      console.log("trustLex is not defined", trustLex);
      return <IOffersResultByNonEvent | any>{ offers: [] };
    }

    let offersData = await trustLex.getOffers(fromOfferId);
    // console.log(offersData);
    let totalFetchedRecords = offersData.total;
    let records = offersData.result;

    const promises = [];
    for (let i = 0; i < totalFetchedRecords; i++) {
      let value = records[i];
      let offer = value.offer;
      let offerId = value.offerId.toString();
      const offerDetailsInJson = {
        offerId: offerId,
        offerQuantity: offer.offerQuantity.toString(),
        offeredBy: offer.offeredBy.toString(),
        offerValidTill: offer.offerValidTill.toString(),
        orderedTime: offer.orderedTime.toString(),
        offeredBlockNumber: offer.offeredBlockNumber.toString(),
        bitcoinAddress: offer.bitcoinAddress.toString(),
        satoshisToReceive: offer.satoshisToReceive.toString(),
        satoshisReceived: offer.satoshisReceived.toString(),
        satoshisReserved: offer.satoshisReserved.toString(),
        collateralPer3Hours: offer.collateralPer3Hours.toString(),
      };
      // console.log(offerDetailsInJson);
      promises.push({ offerDetailsInJson });
    }
    const offersList = await Promise.all(promises);
    return <IOffersResultByNonEvent | any>{
      offers: offersList,
    };

    console.log(offersData);
  } catch (error) {
    console.log(error);
    return <IOffersResultByNonEvent | any>{ offers: [] };
  }
};

// Old method to fetch the list by events
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
      // estimatedFromBlock = Math.max(0, toBlock - MAX_BLOCKS_TO_QUERY);
      estimatedFromBlock = Math.max(0, toBlock);
    } else if (toBlock > 0) {
      estimatedFromBlock = Math.max(fromBlock, toBlock - MAX_BLOCKS_TO_QUERY);
    }

    const offers: IListenedOfferData[] = [];
    let iterations = 0;
    do {
      estimatedFromBlock = Math.max(
        fromBlock,
        estimatedFromBlock - MAX_BLOCKS_TO_QUERY
      );
      const offersSubSet = await trustLex.queryFilter(
        "NEW_OFFER",
        estimatedFromBlock,
        estimatedFromBlock + MAX_BLOCKS_TO_QUERY
      );
      const promises = offersSubSet.map(async (offer) => {
        const offerEvent = {
          from: offer.args ? offer.args[0] : "",
          to: offer.args ? offer.args[1] : "",
        };

        const offerData = await getOffers(trustLex, offerEvent.to);
        // console.log(offerData);
        const offerDetailsInJson = {
          offerId: offerEvent.to.toString(),
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
      });
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

export const listInitializeFullfillment = async (
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
      // estimatedFromBlock = Math.max(0, toBlock - MAX_BLOCKS_TO_QUERY);
      estimatedFromBlock = Math.max(0, toBlock);
    } else if (toBlock > 0) {
      estimatedFromBlock = Math.max(fromBlock, toBlock - MAX_BLOCKS_TO_QUERY);
    }

    const offers: IListInitiatedFullfillmentData[] = [];
    let iterations = 0;
    do {
      estimatedFromBlock = Math.max(
        fromBlock,
        estimatedFromBlock - MAX_BLOCKS_TO_QUERY
      );
      const offersSubSet = await trustLex.queryFilter(
        "INITIALIZED_FULFILLMENT",
        estimatedFromBlock,
        estimatedFromBlock + MAX_BLOCKS_TO_QUERY
      );
      // console.log(offersSubSet);
      const promises = offersSubSet.map(async (offer) => {
        const offerEvent = {
          claimedBy: offer.args ? offer.args[0] : "",
          offerId: offer.args ? offer.args[1] : "",
          fulfillmentId: offer.args ? offer.args[2] : "",
        };

        const FulfillmentsData = await getInitializedFulfillments(
          trustLex,
          offerEvent.offerId,
          offerEvent.fulfillmentId
        );
        const offerData = await getOffers(trustLex, offerEvent.offerId);
        // console.log("FulfillmentsData", FulfillmentsData);
        // console.log("offerData", offerData);
        // return false;

        const offerDetailsInJson: IOfferdata = {
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
        const offersFullfillmentJson: IFullfillmentEvent = {
          allowAnyoneToAddCollateralForFee:
            FulfillmentsData["allowAnyoneToAddCollateralForFee"],
          allowAnyoneToSubmitPaymentProofForFee:
            FulfillmentsData["allowAnyoneToSubmitPaymentProofForFee"],
          collateralAddedBy: FulfillmentsData["collateralAddedBy"],
          expiryTime: FulfillmentsData["expiryTime"],
          fulfilledTime: FulfillmentsData["fulfilledTime"],
          fulfillmentBy: FulfillmentsData["fulfillmentBy"],
          quantityRequested: FulfillmentsData["quantityRequested"].toString(),
          totalCollateralAdded:
            FulfillmentsData["totalCollateralAdded"].toString(),
        };
        return { offerEvent, offerDetailsInJson, offersFullfillmentJson };
      });
      const offersList: any[] = await Promise.all(promises);
      offersList.forEach((o) => {
        offers.push(o);
      });
      iterations++;
    } while (estimatedFromBlock > fromBlock && iterations < MAX_ITERATIONS);
    return {
      fromBlock: fromBlock,
      toBlock: toBlock,
      offers: offers,
    };
  } catch (error) {
    console.log(error);
    return { offers: [], fromBlock, toBlock };
  }
};

export const getInitializedFulfillments = async (
  trustLex: ethers.Contract | undefined,
  offerId: number,
  fulfillmentId: number
) => {
  try {
    if (!trustLex) return false;

    let offerData = await trustLex.initializedFulfillments(
      offerId,
      fulfillmentId
    );
    // let tokenContract = await trustLex.tokenContract();

    // console.log("TokenContracts", tokenContract);

    return offerData;
  } catch (error) {
    console.log(error);
    return;
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
