import React from "react";
import { IAddOfferWithEth } from "~/interfaces/IAddOfferWithEth";
import abi from "../files/contract.json";
import { Wallet, ethers } from "ethers";
import { IAddOfferWithToken } from "~/interfaces/IAddOfferWithToken";
import erc20ContractABI from "~/files/erc20Contract.json";
import { ERC20 } from "~/Context/AppConfig";
import { ContractMap } from "~/Context/AppConfig";
import {
  IFullfillmentEvent,
  IListenedOfferData,
  INewOfferEvent,
  IOfferdata,
  IinitiatedFullfillmentResult,
  IListInitiatedFullfillmentData,
  IOffersResultByNonEvent,
  IFullfillmentResult,
  IListInitiatedFullfillmentDataByNonEvent,
} from "~/interfaces/IOfferdata";
import axios from "axios";
import { PAGE_SIZE, currencyObjects } from "~/Context/Constants";
import { MAX_BLOCKS_TO_QUERY, MAX_ITERATIONS } from "~/Context/Constants";
import { EthtoWei, WeitoEth } from "~/utils/Ether.utills";
import { AppContext } from "~/Context/AppContext";
import { ToastContainer, toast } from "react-toastify";
import { TimestampTotoNow, TimestampfromNow } from "~/utils/TimeConverter";

const getEthereumObject = () => window.ethereum;

export const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();
    if (!ethereum || ethereum.request === undefined) {
      return false;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      return account;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const connectToMetamask = async () => {
  try {
    const ethereum = getEthereumObject();
    if (!ethereum || ethereum.request === undefined) {
      showErrorMessage("Get MetaMask!");
      return false;
    }
    // console.log(ethereum.request);
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (error) {
    console.log(error);
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
    console.log(error);
    return false;
  }
};

export const getBalance = async (address: string) => {
  try {
    if (typeof window.ethereum !== undefined) {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      let balance: any = await provider.getBalance(address);
      balance = (+ethers.utils.formatEther(balance)).toFixed(4);
      return balance;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const createContractInstance = async (
  contractAddress: string,
  contractABI: string
): Promise<ethers.Contract | false> => {
  try {
    if (typeof window.ethereum !== undefined) {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);

      const signer = provider.getSigner();
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

export const getERC20TokenBalance = async (
  address: string,
  contractAddress: string,
  contractABI: string
): Promise<number> => {
  try {
    if (typeof window.ethereum !== undefined && contractAddress != "") {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);

      const signer = provider.getSigner();
      const erc20TokenContract = new ethers.Contract(
        // ERC20.address,
        // erc20ContractABI.abi,
        contractAddress,
        contractABI,
        signer
      );

      let balance = await erc20TokenContract.balanceOf(address);
      balance = +ethers.utils.formatEther(balance);
      return balance;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error);
    return 0;
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

    return offerData;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getOffer = async (
  trustLex: ethers.Contract | undefined,
  offerId: any,
  account: string = ""
) => {
  try {
    if (!trustLex) return false;

    let offer: IOfferdata = await trustLex.getOffer(offerId);

    const offerDetailsInJson: IOfferdata = {
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
      fulfillmentRequests: offer.fulfillmentRequests,
      progress: "",
      offerType: "",
      fullfillmentRequestId: undefined,
    };
    let satoshisToReceive = offer.satoshisToReceive;
    let satoshisReceived = offer.satoshisReceived;
    let ConditionFlag;
    if (account != "") {
      if (offer.offeredBy.toLowerCase() == account.toLowerCase()) {
        ConditionFlag = true;
      } else {
        ConditionFlag = false;
      }
    } else {
      ConditionFlag = true;
    }
    if (
      ConditionFlag &&
      satoshisReceived.toString() != satoshisToReceive.toString()
    ) {
      let filled = 0;
      let satoshisReserved = offer.satoshisReserved;
      let satoshisToReceive = offer.satoshisToReceive;
      let satoshisReceived = offer.satoshisReceived;
      filled =
        ((Number(satoshisReserved) + Number(satoshisReceived)) /
          Number(satoshisToReceive)) *
        100;
      offerDetailsInJson.progress = filled + "% filled";
      offerDetailsInJson.offerType = "my_offer";
    }
    // get the fullfillment list
    let FullfillmentResults: IFullfillmentResult[] =
      await getInitializedFulfillmentsByOfferId(trustLex, offerId);

    let fullfillmentRequestId = undefined;
    let fullfillmentResult =
      FullfillmentResults &&
      FullfillmentResults.find((fullfillmentResult, index) => {
        if (
          fullfillmentResult.fulfillmentRequest.fulfillmentBy.toLowerCase() ===
            account.toLowerCase() &&
          fullfillmentResult.fulfillmentRequest.paymentProofSubmitted == false
        ) {
          fullfillmentRequestId = offer.fulfillmentRequests[index];
          return true;
        } else {
          return false;
        }
      });
    if (fullfillmentResult) {
      offerDetailsInJson.offerType = "my_order";
      offerDetailsInJson.progress =
        TimestampTotoNow(fullfillmentResult.fulfillmentRequest.expiryTime) +
        " and " +
        TimestampfromNow(fullfillmentResult.fulfillmentRequest.expiryTime);
      offerDetailsInJson.fullfillmentRequestId = fullfillmentRequestId;
      offerDetailsInJson.fulfillmentRequestExpiryTime =
        fullfillmentResult.fulfillmentRequest.expiryTime;
      offerDetailsInJson.fulfillmentRequestQuantityRequested =
        fullfillmentResult.fulfillmentRequest.quantityRequested.toString();
      offerDetailsInJson.fulfillmentRequestPaymentProofSubmitted =
        fullfillmentResult.fulfillmentRequest.paymentProofSubmitted;
    }

    return offerDetailsInJson;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const AddOfferWithEth = async (
  trustLex: ethers.Contract | undefined,
  data: IAddOfferWithEth,
  sellCurrecny: string
) => {
  const { weieth, satoshis, bitcoinAddress, offerValidTill, account } = data;

  try {
    if (!trustLex) {
      let message = "trustLex is not defined";
      showErrorMessage(message);
      throw new Error(message);
    }

    // Get the ETH account
    // const account = await connectToMetamask();
    // Get the ETH balance
    const EthBalance = await getBalance(account);
    const userInputEth = WeitoEth(weieth);

    if (userInputEth > EthBalance) {
      let message = `Your ${sellCurrecny.toUpperCase()} balance is low !`;
      showErrorMessage(message);
      throw new Error(message);
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

export const addOfferWithToken = async (
  data: IAddOfferWithToken,
  sellCurrecny: string,
  inputTokens: string,
  selectedNetwork: string
) => {
  // first approve contract to spend the tokens
  try {
    if (typeof window.ethereum !== undefined) {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      let accounts = await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const erc20TokenContract = new ethers.Contract(
        ERC20.address,
        erc20ContractABI.abi,
        signer
      );
      let tokens = data.tokens;
      sellCurrecny;
      // To do Add the balance validation check
      let contractAddress =
        currencyObjects[selectedNetwork][sellCurrecny.toLowerCase()]
          .ERC20Address;

      let contractABI =
        currencyObjects[selectedNetwork][sellCurrecny.toLowerCase()].ERC20ABI;
      let accountOwnerBal: number = await getERC20TokenBalance(
        accounts[0],
        contractAddress,
        contractABI
      );
      if (accountOwnerBal < Number(inputTokens)) {
        showErrorMessage(
          `Your token ${sellCurrecny.toUpperCase()} balance is low.`
        );
        return false;
      }

      let spender = ContractMap.SPVC.address;
      //tokens = EthtoWei(tokens as string);

      let transaction = await erc20TokenContract.increaseAllowance(
        spender,
        tokens
      );
      await transaction.wait();
      console.log(transaction);

      // create the contract instance
      let OrderBookContractForTokenAddress = spender;
      const OrderBookContractForToken = new ethers.Contract(
        OrderBookContractForTokenAddress,
        abi.abi,
        signer
      );
      let transaction2 = await OrderBookContractForToken.addOfferWithToken(
        tokens,
        data.satoshis,
        "0x" + data.bitcoinAddress,
        data.offerValidTill
      );
      await transaction2.wait();
      console.log(transaction2);
      return transaction2;
    } else {
      showErrorMessage("Metamask not found!");
      return false;
    }
  } catch (error: any) {
    let message = error?.message;
    console.log(error);
    return false;
  }
};

export const increaseContractAllownace = async (
  selectedToken: string,
  tokenAmount: string, // in SPVC
  selectedNetwork: string
) => {
  // first approve contract to spend the tokens
  try {
    if (typeof window.ethereum !== undefined) {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      let accounts = await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      let contractAddress =
        currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
          .ERC20Address;

      let contractABI =
        currencyObjects[selectedNetwork][selectedToken.toLowerCase()].ERC20ABI;
      let spender =
        currencyObjects[selectedToken.toLowerCase()].orderBookContractAddreess;
      if (!(contractAddress && contractABI && spender)) return false;

      const erc20TokenContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      let tokens = Number(tokenAmount);

      // To do Add the balance validation check
      let accountOwnerBal: number = await getERC20TokenBalance(
        accounts[0],
        contractAddress,
        contractABI
      );

      if (accountOwnerBal < tokens) {
        showErrorMessage("Your token balance is low.");
        return false;
      }

      let tokens_ = EthtoWei(tokenAmount);

      let transaction = await erc20TokenContract.increaseAllowance(
        spender,
        tokens_
      );
      await transaction.wait();
      console.log(transaction);

      // create the contract instance
      // let OrderBookContractForTokenAddress = spender;
      // const OrderBookContractForToken = new ethers.Contract(
      //   OrderBookContractForTokenAddress,
      //   abi.abi,
      //   signer
      // );
      // let transaction2 = await OrderBookContractForToken.addOfferWithToken(
      //   tokens,
      //   data.satoshis,
      //   "0x" + data.bitcoinAddress,
      //   data.offerValidTill
      // );
      // await transaction2.wait();
      // console.log(transaction2);
      return transaction;
    } else {
      showErrorMessage("Metamask not found!");
      return false;
    }
  } catch (error: any) {
    let message = error?.message;
    console.log(error);
    return false;
  }
};

export const getOffersList = async (
  trustLex: ethers.Contract | undefined,
  fromOfferId: number
) => {
  try {
    if (!trustLex) {
      console.log("trustLex is not defined", trustLex);
      return <IOffersResultByNonEvent>{ offers: [] };
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
        fulfillmentRequests: offer.fulfillmentRequests,
        fullfillmentResults: undefined,
      };

      // if (
      //   Number(offerDetailsInJson.satoshisToReceive) ==
      //   Number(offerDetailsInJson.satoshisReserved) +
      //     Number(offerDetailsInJson.satoshisReceived)
      // ) {

      // fetch the intial fullfillment
      let allFullfillments = await getInitializedFulfillmentsByOfferId(
        trustLex,
        offerDetailsInJson.offerId
      );
      offerDetailsInJson.fullfillmentResults = allFullfillments;

      // }
      // console.log(offerDetailsInJson);
      promises.push({ offerDetailsInJson });
    }
    const offersList = await Promise.all(promises);
    return <IOffersResultByNonEvent>{
      offers: offersList,
    };
  } catch (error) {
    console.log(error);
    return <IOffersResultByNonEvent | any>{ offers: [] };
  }
};

export const listInitializeFullfillmentOnGoingByNonEvent = async (
  trustLex: ethers.Contract | undefined,
  account: string,
  fromOfferId: number
) => {
  let MyoffersList: IListInitiatedFullfillmentDataByNonEvent[] = [];
  if (!trustLex) {
    console.log("trustLex is not defined", trustLex);
    return MyoffersList;
  }
  let offersData = await trustLex.getOffers(fromOfferId);

  let totalFetchedRecords = offersData.total;
  let offers = offersData.result;
  let MyOngoingOrdersPromises = [];
  const MyOffersPromises = [];
  for (let i = 0; i < totalFetchedRecords; i++) {
    let value = offers[i];
    let offer = value.offer;
    let offerId = value.offerId.toString();
    let fulfillmentRequests = value.fulfillmentRequests;

    const offerDetailsInJson: IOfferdata = {
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
      fulfillmentRequests: offer.fulfillmentRequests,
      progress: "",
      offerType: "",
      fullfillmentRequestId: undefined,
    };
    let satoshisToReceive = offer.satoshisToReceive;
    let satoshisReceived = offer.satoshisReceived;
    // my offer data
    if (
      offer.offeredBy.toLowerCase() === account.toLowerCase() &&
      satoshisReceived.toString() != satoshisToReceive.toString()
    ) {
      let filled = 0;
      let satoshisReserved = offer.satoshisReserved;
      let satoshisToReceive = offer.satoshisToReceive;
      let satoshisReceived = offer.satoshisReceived;
      filled =
        ((Number(satoshisReserved) + Number(satoshisReceived)) /
          satoshisToReceive) *
        100;
      offerDetailsInJson.progress = filled + "% filled";
      offerDetailsInJson.offerType = "my_offer";
      MyOffersPromises.push({ offerDetailsInJson });
    }
    // get the fullfillment list
    let FullfillmentResults: IFullfillmentResult[] =
      await getInitializedFulfillmentsByOfferId(trustLex, value.offerId);

    let fullfillmentRequestId = undefined;
    let fullfillmentResult =
      FullfillmentResults &&
      FullfillmentResults.find((fullfillmentResult, index) => {
        if (
          fullfillmentResult.fulfillmentRequest.fulfillmentBy.toLowerCase() ===
            account.toLowerCase() &&
          fullfillmentResult.fulfillmentRequest.paymentProofSubmitted == false
        ) {
          fullfillmentRequestId = offer.fulfillmentRequests[index];
          return true;
        } else {
          return false;
        }
      });
    if (fullfillmentResult) {
      offerDetailsInJson.offerType = "my_order";
      offerDetailsInJson.progress =
        TimestampTotoNow(fullfillmentResult.fulfillmentRequest.expiryTime) +
        " and " +
        TimestampfromNow(fullfillmentResult.fulfillmentRequest.expiryTime);
      offerDetailsInJson.fullfillmentRequestId = fullfillmentRequestId;
      offerDetailsInJson.fulfillmentRequestExpiryTime =
        fullfillmentResult.fulfillmentRequest.expiryTime;
      offerDetailsInJson.fulfillmentRequestQuantityRequested =
        fullfillmentResult.fulfillmentRequest.quantityRequested.toString();
      offerDetailsInJson.fulfillmentRequestPaymentProofSubmitted =
        fullfillmentResult.fulfillmentRequest.paymentProofSubmitted;
    }
    fullfillmentResult &&
      MyOffersPromises.push({ offerDetailsInJson: offerDetailsInJson });
  }
  MyoffersList = await Promise.all(MyOffersPromises);
  return MyoffersList;
};

//Get the My Swap comleted offers list .Offers are created by an account or ordered by same account.
export const listInitializeFullfillmentCompletedByNonEvent = async (
  trustLex: ethers.Contract | undefined,
  account: string = "",
  fromOfferId: number
) => {
  let MyoffersList: IListInitiatedFullfillmentDataByNonEvent[] = [];
  if (!trustLex) {
    console.log("trustLex is not defined", trustLex);
    return MyoffersList;
  }
  let offersData = await trustLex.getOffers(fromOfferId);
  let totalFetchedRecords = offersData.total;
  let offers = offersData.result;
  const MyOffersPromises = [];
  for (let i = 0; i < totalFetchedRecords; i++) {
    let value = offers[i];
    let offer = value.offer;
    let offerId = value.offerId.toString();
    let fulfillmentRequests = value.fulfillmentRequests;

    const offerDetailsInJson: IOfferdata = {
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
      fulfillmentRequests: offer.fulfillmentRequests,
      progress: "",
      offerType: "",
      fullfillmentRequestId: undefined,
    };
    let satoshisReserved = offer.satoshisReserved;
    let satoshisToReceive = offer.satoshisToReceive;
    let satoshisReceived = offer.satoshisReceived;
    let ConditionFlag;
    if (account != "") {
      if (offer.offeredBy.toLowerCase() == account.toLowerCase()) {
        ConditionFlag = true;
      } else {
        ConditionFlag = false;
      }
    } else {
      ConditionFlag = true;
    }
    if (
      ConditionFlag &&
      satoshisReceived.toString() == satoshisToReceive.toString()
    ) {
      let filled = 0;
      let satoshisReserved = offer.satoshisReserved;
      let satoshisToReceive = offer.satoshisToReceive;
      filled = (satoshisReserved / satoshisToReceive) * 100;
      offerDetailsInJson.progress = filled + "% filled";
      offerDetailsInJson.offerType = "my_offer";
      MyOffersPromises.push({ offerDetailsInJson });
    }
    if (account != "") {
      // get the fullfillment list
      let FullfillmentResults: IFullfillmentResult[] =
        await getInitializedFulfillmentsByOfferId(trustLex, value.offerId);
      if (FullfillmentResults && FullfillmentResults.length > 0) {
        // console.log(FullfillmentResults);
        let fullfillmentRequestIds: string[] = [];
        let fullfillmentFilteredResult = FullfillmentResults.filter(
          (fullfillmentResult, index) => {
            if (
              fullfillmentResult.fulfillmentRequest.fulfillmentBy.toLowerCase() ===
                account.toLowerCase() &&
              fullfillmentResult.fulfillmentRequest.paymentProofSubmitted ==
                true
            ) {
              let fullfillmentRequestId = offer.fulfillmentRequests[index];
              fullfillmentRequestIds.push(fullfillmentRequestId);
              return true;
            } else {
              return false;
            }
          }
        );

        fullfillmentFilteredResult.map((value, index) => {
          let fullfillmentResult = value;
          let offerDetailsInJson2: IOfferdata = { ...offerDetailsInJson };
          let quantityRequested =
            fullfillmentResult.fulfillmentRequest.quantityRequested.toString();

          offerDetailsInJson2.offerType = "my_order";
          offerDetailsInJson2.progress =
            TimestampTotoNow(fullfillmentResult.fulfillmentRequest.expiryTime) +
            " and " +
            TimestampfromNow(fullfillmentResult.fulfillmentRequest.expiryTime);
          offerDetailsInJson2.fullfillmentRequestId =
            fullfillmentRequestIds[index];
          offerDetailsInJson2.fulfillmentRequestExpiryTime =
            fullfillmentResult.fulfillmentRequest.expiryTime;
          offerDetailsInJson2.fulfillmentRequestQuantityRequested =
            quantityRequested;

          offerDetailsInJson2.fulfillmentRequestPaymentProofSubmitted =
            fullfillmentResult.fulfillmentRequest.paymentProofSubmitted;
          offerDetailsInJson2.fulfillmentRequestfulfilledTime =
            fullfillmentResult.fulfillmentRequest.fulfilledTime;

          MyOffersPromises.push({ offerDetailsInJson: offerDetailsInJson2 });
        });
      }
    }
  }
  MyoffersList = await Promise.all(MyOffersPromises);
  return MyoffersList;
};

// get the perticular fullfillment details by fullfillment id
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

export const getInitializedFulfillmentsByOfferId = async (
  trustLex: ethers.Contract | undefined,
  offerId: number
) => {
  let fullfillmentResult: IFullfillmentResult[] = [];
  try {
    if (!trustLex) return false;

    let fullfillmentResult = await trustLex.getInitiateFulfillments(offerId);
    return fullfillmentResult;
  } catch (error) {
    console.log(error);
    return fullfillmentResult;
  }
};
export const InitializeFullfillment = async (
  trustLex: ethers.Contract | undefined,
  offerId: string,
  _fulfillment: IFullfillmentEvent,
  colletarealValue: string
) => {
  try {
    if (!trustLex) return false;
    const initializeFullfillment = await trustLex.initiateFulfillment(
      offerId,
      _fulfillment,
      { value: colletarealValue }
    );

    await initializeFullfillment.wait();
    let tx = await initializeFullfillment.wait();
    return tx;
  } catch (error: any) {
    console.log(error?.message);
    console.log(error);
    // console.log(JSON.stringify(error), null, 4);
  }
};

export const showSuccessMessage = (message: string) => {
  // let message = "Transaction successfully done !";
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored", //light, dark,colored
  });
};

export const showErrorMessage = (message: string) => {
  // let message = "Transaction successfully done !";
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored", //light, dark,colored
  });
};

export const submitPaymentProof = async (
  trustLex: ethers.Contract | undefined,
  offerId: string,
  fulfillmentId: string
) => {
  try {
    if (!trustLex) return false;
    const transaction = await trustLex.submitPaymentProof(
      offerId,
      fulfillmentId
    );

    let tx = await transaction.wait();
    return tx;
  } catch (error: any) {
    console.log(error?.message);
    console.log(error);
  }
};

export const extendOffer = async (
  trustLex: ethers.Contract | undefined,
  offerId: string,
  offerValidTill: number
) => {
  try {
    if (!trustLex) return false;
    const transaction = await trustLex.extendOffer(offerId, offerValidTill);

    let tx = await transaction.wait();
    return tx;
  } catch (error: any) {
    console.log(error?.message);
    console.log(error);
    return false;
  }
};
