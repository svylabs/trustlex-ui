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
  IListInitiatedFullfillmentDataByNonEvent,
  SettlementRequest,
  IResultSettlementRequest,
  IResultOffer,
} from "~/interfaces/IOfferdata";
import axios from "axios";
import { PAGE_SIZE, currencyObjects } from "~/Context/Constants";
import { MAX_BLOCKS_TO_QUERY, MAX_ITERATIONS } from "~/Context/Constants";
import { EthtoWei, WeitoEth } from "~/utils/Ether.utills";
import { AppContext } from "~/Context/AppContext";
import { ToastContainer, toast } from "react-toastify";
import { TimestampTotoNow, TimestampfromNow } from "~/utils/TimeConverter";
import { HTLCDetail, IBitcoinPaymentProof } from "~/interfaces/IBitcoinNode";
import moment from "moment";
import { tofixedBTC } from "~/utils/BitcoinUtils";

// import { useWeb3React } from "@web3-react/core";
// import { injected } from "~/components/Connectors/connectors";

export const getEthereumObject = () => window.ethereum;
// https://snyk.io/advisor/npm-package/ethereum-block-by-date
const { EthDater } = window;

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

export const isMetamaskConnectedService = async () => {
  if (
    getEthereumObject() === undefined ||
    // window.ethereum.isConnected() === false
    // ||
    (await findMetaMaskAccount()) === false
  ) {
    return false;
  }
  return true;
};

export const findWalletConnetAccount = async () => {
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
    if (ethereum == undefined || ethereum.request === undefined) {
      // showErrorMessage("Get MetaMask!");
      // alert("Get MetaMask!");
      console.log("Get MetaMask!");
      return false;
    }
    // console.log(ethereum.request);
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (error) {
    return false;
  }
};
export const listOffers = async (
  trustLex: ethers.Contract | undefined,
  fromBlock: number = 0,
  toBlock: "latest" | number = "latest"
) => {
  try {
    console.log("Querying... ", fromBlock, toBlock);
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
      estimatedFromBlock = Math.max(
        fromBlock,
        estimatedFromBlock - MAX_BLOCKS_TO_QUERY
      );
      console.log(
        "Querying... ",
        estimatedFromBlock,
        estimatedFromBlock + MAX_BLOCKS_TO_QUERY
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
      });
      iterations++;
    } while (estimatedFromBlock > fromBlock && iterations < MAX_ITERATIONS);
    // console.log(offers);
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

export const getEventData = async (
  ContractInstance: ethers.Contract,
  fromLastHours: number = 0,
  receivedByAddress: string = "",
  ethereumObject: any
) => {
  try {
    // console.log(fromLastHours, receivedByAddress);
    if (typeof ethereumObject !== undefined) {
      // const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereumObject);
      let toBlock: any = await provider.getBlockNumber();
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

      let PAYMENT_SUCCESSFUL_EVENTS = await ContractInstance.queryFilter(
        "SETTLEMENT_SUCCESSFUL",
        estimatedFromBlock,
        toBlock
      );
      // console.log(PAYMENT_SUCCESSFUL_EVENTS);
      let total_quantityRequested = 0;
      // console.log(PAYMENT_SUCCESSFUL_EVENTS);
      if (receivedByAddress != "") {
        PAYMENT_SUCCESSFUL_EVENTS = PAYMENT_SUCCESSFUL_EVENTS.filter(
          (value: any, index) => {
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
      // console.log(PAYMENT_SUCCESSFUL_EVENTS);
      // console.log(total_quantityRequested);

      // Converting satoshi to Btc
      total_quantityRequested = Number(
        tofixedBTC(total_quantityRequested / 10 ** 8)
      );
      return total_quantityRequested;
    } else {
      return 0;
    }
  } catch (err) {
    console.log(err);
    return 0;
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

export const getBalance = async (ethereumObject: any, address: string) => {
  try {
    // console.log(ethereumObject, address);
    const provider = new ethers.providers.Web3Provider(ethereumObject);
    let balance: any = await provider.getBalance(address);
    balance = +ethers.utils.formatEther(balance);

    // console.log(balance);
    return balance;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const createContractInstance = async (
  contractAddress: string,
  contractABI: string
): Promise<ethers.Contract | false> => {
  try {
    const { ethereum } = window;
    if (typeof ethereum !== undefined) {
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

export const getTotalOffers = async (
  trustLex: ethers.Contract | undefined,
  walletName: string = "metamask"
) => {
  try {
    if (!trustLex) return false;
    let offerData;
    if (walletName == "metamask") {
      offerData = await trustLex.getTotalOffers();
    } else if (walletName == "wallet_connect") {
      offerData = await trustLex.read.getTotalOffers();
    }

    return offerData.toString();
  } catch (error) {
    console.log("error");
    console.log(error);
    return 0;
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
  account: string = "",
  walletName: string = "metamask"
) => {
  try {
    if (!trustLex) return false;

    let offer: IOfferdata;
    if (walletName == "metamask") {
      offer = await trustLex.getOffer(offerId);
    }
    if (walletName == "wallet_connect") {
      offer = await trustLex.read.getOffer([offerId]);
    }

    const offerDetailsInJson: IOfferdata = {
      offerId: offerId,
      offerQuantity: offer.offerQuantity.toString(),
      offeredBy: offer.offeredBy.toString(),
      offerValidTill: offer.offerValidTill.toString(),
      orderedTime: offer.orderedTime.toString(),
      offeredBlockNumber: offer.offeredBlockNumber.toString(),
      pubKeyHash: offer.pubKeyHash.toString(),
      satoshisToReceive: offer.satoshisToReceive.toString(),
      satoshisReceived: offer.satoshisReceived.toString(),
      satoshisReserved: offer.satoshisReserved.toString(),
      settlementRequests: offer.settlementRequests,
      progress: "",
      offerType: "",
      fullfillmentRequestId: undefined,
      isCanceled: offer.isCanceled,
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
      offerDetailsInJson.progress = filled.toString();
      offerDetailsInJson.offerType = "my_offer";
    }
    // get the fullfillment list
    let FullfillmentResults: IResultSettlementRequest[] =
      await getInitializedFulfillmentsByOfferId(trustLex, offerId, walletName);

    let fullfillmentRequestId = undefined;
    let fullfillmentResult =
      FullfillmentResults &&
      FullfillmentResults.find((fullfillmentResult, index) => {
        if (
          fullfillmentResult.settlementRequest.settledBy.toLowerCase() ===
          account.toLowerCase()
          //   &&
          // fullfillmentResult.settlementRequest.settled == false
        ) {
          fullfillmentRequestId = offer.settlementRequests[index];
          return true;
        } else {
          return false;
        }
      });
    if (fullfillmentResult) {
      offerDetailsInJson.offerType = "my_order";
      offerDetailsInJson.progress =
        TimestampTotoNow(
          fullfillmentResult.settlementRequest.expiryTime as string
        ) +
        " and " +
        TimestampfromNow(
          fullfillmentResult.settlementRequest.expiryTime as string
        );
      offerDetailsInJson.fullfillmentRequestId = fullfillmentRequestId;
      offerDetailsInJson.fulfillmentRequestExpiryTime =
        fullfillmentResult.settlementRequest.expiryTime;
      offerDetailsInJson.fulfillmentRequestQuantityRequested =
        fullfillmentResult.settlementRequest.quantityRequested.toString();
      // offerDetailsInJson.fulfillmentRequestsettled =
      //   fullfillmentResult.settlementRequest.settled;
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
  sellCurrecny: string,
  ethereumObject: any
) => {
  const { weieth, satoshis, pubKeyHash, offerValidTill, account } = data;

  try {
    if (!trustLex) {
      let message = "trustLex is not defined";
      showErrorMessage(message);
      throw new Error(message);
    }

    // Get the ETH account
    // const account = await connectToMetamask();
    // Get the ETH balance
    const EthBalance = await getBalance(ethereumObject, account);

    const userInputEth = WeitoEth(weieth);

    if (userInputEth > EthBalance) {
      let message = `Your ${sellCurrecny.toUpperCase()} balance is low !`;
      showErrorMessage(message);
      throw new Error(message);
    }

    const addOffer = await trustLex.addOfferWithEth(
      weieth,
      satoshis,
      "0x" + pubKeyHash,
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
        contractAddress as string,
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
  fromOfferId: number,
  walletName: string
) => {
  try {
    if (!trustLex) {
      console.log("trustLex is not defined", trustLex);
      return <IOffersResultByNonEvent>{ offers: [] };
    }

    let offersData: any;
    let totalFetchedRecords: number = 0;
    let records: any = [];

    if (walletName == "metamask") {
      offersData = await trustLex.getOffers(fromOfferId);
      totalFetchedRecords = offersData.total;
      records = offersData.result;
    }
    if (walletName == "wallet_connect") {
      offersData = await trustLex.read.getOffers([fromOfferId]);
      totalFetchedRecords = offersData[1];
      records = offersData[0];
    }

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
        pubKeyHash: offer.pubKeyHash.toString(),
        satoshisToReceive: offer.satoshisToReceive.toString(),
        satoshisReceived: offer.satoshisReceived.toString(),
        satoshisReserved: offer.satoshisReserved.toString(),
        settlementRequests: offer.settlementRequests,
        settlementRequestResults: undefined,
        isCanceled: offer.isCanceled,
      };

      // if (
      //   Number(offerDetailsInJson.satoshisToReceive) ==
      //   Number(offerDetailsInJson.satoshisReserved) +
      //     Number(offerDetailsInJson.satoshisReceived)
      // ) {

      // fetch the intial fullfillment
      let allFullfillments = await getInitializedFulfillmentsByOfferId(
        trustLex,
        offerDetailsInJson.offerId,
        walletName
      );

      offerDetailsInJson.settlementRequestResults = allFullfillments;

      // }
      // console.log(offerDetailsInJson);
      promises.push({ offerDetailsInJson });
    }

    const offersList = await Promise.all(promises);
    // console.log(offersList);
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
  fromOfferId: number,
  walletName: string = "metamask"
) => {
  let MyoffersList: IListInitiatedFullfillmentDataByNonEvent[] = [];
  if (!trustLex) {
    console.log("trustLex is not defined", trustLex);
    return MyoffersList;
  }
  let offersData: any;
  let totalFetchedRecords: number;
  let offers: IResultOffer[];

  if (walletName == "metamask") {
    offersData = await trustLex.getOffers(fromOfferId);
    totalFetchedRecords = offersData.total;
    offers = offersData.result;
  } else if (walletName == "wallet_connect") {
    offersData = await trustLex.read.getOffers([fromOfferId]);

    totalFetchedRecords = Number(offersData[1]);
    offers = offersData[0];
  }

  let MyOngoingOrdersPromises = [];
  const MyOffersPromises = [];
  for (let i = 0; i < totalFetchedRecords; i++) {
    let value = offers[i];
    let offer = value.offer;

    let offerId = value.offerId.toString();

    const offerDetailsInJson: IOfferdata = {
      offerId: offerId,
      offerQuantity: offer.offerQuantity.toString(),
      offeredBy: offer.offeredBy.toString(),
      offerValidTill: offer.offerValidTill.toString(),
      orderedTime: offer.orderedTime.toString(),
      offeredBlockNumber: offer.offeredBlockNumber.toString(),
      pubKeyHash: offer.pubKeyHash?.toString(),
      satoshisToReceive: offer.satoshisToReceive.toString(),
      satoshisReceived: offer.satoshisReceived.toString(),
      satoshisReserved: offer.satoshisReserved.toString(),
      settlementRequests: offer.settlementRequests,
      progress: "",
      offerType: "",
      fullfillmentRequestId: undefined,
      isCanceled: offer.isCanceled,
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
          Number(satoshisToReceive)) *
        100;
      offerDetailsInJson.progress = filled.toString();
      offerDetailsInJson.offerType = "my_offer";
      MyOffersPromises.push({ offerDetailsInJson });
    }
    // get the fullfillment list
    let FullfillmentResults: IResultSettlementRequest[] =
      await getInitializedFulfillmentsByOfferId(
        trustLex,
        Number(value.offerId),
        walletName
      );

    let fullfillmentRequestId = undefined;
    let fullfillmentResult =
      FullfillmentResults &&
      FullfillmentResults.find((fullfillmentResult, index) => {
        if (
          fullfillmentResult.settlementRequest.settledBy.toLowerCase() ===
            account.toLowerCase() &&
          fullfillmentResult.settlementRequest.settled == false
        ) {
          fullfillmentRequestId = offer.settlementRequests[index];
          return true;
        } else {
          return false;
        }
      });
    if (fullfillmentResult) {
      offerDetailsInJson.offerType = "my_order";
      offerDetailsInJson.progress =
        TimestampTotoNow(
          "" + fullfillmentResult.settlementRequest.settlementRequestedTime
        ) +
        " and " +
        TimestampfromNow(
          fullfillmentResult.settlementRequest?.expiryTime as string
        );
      offerDetailsInJson.fullfillmentRequestId = fullfillmentRequestId;
      offerDetailsInJson.fulfillmentRequestExpiryTime =
        fullfillmentResult.settlementRequest.expiryTime;
      offerDetailsInJson.fulfillmentRequestQuantityRequested =
        fullfillmentResult.settlementRequest.quantityRequested.toString();
      offerDetailsInJson.fulfillmentRequestSettled =
        fullfillmentResult.settlementRequest.settled;
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
  fromOfferId: number,
  walletName: string = "metamask"
) => {
  let MyoffersList: IListInitiatedFullfillmentDataByNonEvent[] = [];
  if (!trustLex) {
    console.log("trustLex is not defined", trustLex);
    return MyoffersList;
  }

  let offersData: any;
  let totalFetchedRecords: number;
  let offers: IResultOffer[];
  if (walletName == "metamask") {
    offersData = await trustLex.getOffers(fromOfferId);

    totalFetchedRecords = offersData.total;
    offers = offersData.result;
  } else if (walletName == "wallet_connect") {
    offersData = await trustLex.read.getOffers([fromOfferId]);

    totalFetchedRecords = Number(offersData[1]);
    offers = offersData[0];
  }

  const MyOffersPromises = [];
  for (let i = 0; i < totalFetchedRecords; i++) {
    let value = offers[i];
    let offer: IOfferdata = value.offer;
    let offerId = value.offerId.toString();

    const offerDetailsInJson: IOfferdata = {
      offerId: offerId,
      offerQuantity: offer.offerQuantity.toString(),
      offeredBy: offer.offeredBy.toString(),
      offerValidTill: offer.offerValidTill.toString(),
      orderedTime: offer.orderedTime.toString(),
      offeredBlockNumber: offer.offeredBlockNumber.toString(),
      pubKeyHash: offer.pubKeyHash.toString(),
      satoshisToReceive: offer.satoshisToReceive.toString(),
      satoshisReceived: offer.satoshisReceived.toString(),
      satoshisReserved: offer.satoshisReserved.toString(),
      settlementRequests: offer.settlementRequests,
      progress: "",
      offerType: "",
      fullfillmentRequestId: undefined,
      isCanceled: offer.isCanceled,
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
      filled = (Number(satoshisReserved) / Number(satoshisToReceive)) * 100;
      offerDetailsInJson.progress = filled + "% filled";
      offerDetailsInJson.offerType = "my_offer";
      MyOffersPromises.push({ offerDetailsInJson });
    }
    if (account != "") {
      // get the fullfillment list
      let FullfillmentResults: IResultSettlementRequest[] =
        await getInitializedFulfillmentsByOfferId(
          trustLex,
          Number(offerId),
          walletName
        );
      if (FullfillmentResults && FullfillmentResults.length > 0) {
        // console.log(FullfillmentResults);
        let fullfillmentRequestIds: string[] = [];
        let fullfillmentFilteredResult = FullfillmentResults.filter(
          (fullfillmentResult, index) => {
            if (
              fullfillmentResult.settlementRequest.settledBy.toLowerCase() ===
                account.toLowerCase() &&
              fullfillmentResult.settlementRequest.settled == true
            ) {
              let fullfillmentRequestId = offer.settlementRequests[index];

              // console.log(fullfillmentRequestId);
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
            fullfillmentResult.settlementRequest.quantityRequested.toString();

          offerDetailsInJson2.offerType = "my_order";
          offerDetailsInJson2.progress =
            TimestampTotoNow(
              "" + fullfillmentResult.settlementRequest.settlementRequestedTime
            ) +
            " and " +
            TimestampfromNow(
              fullfillmentResult.settlementRequest.expiryTime as string
            );
          offerDetailsInJson2.fullfillmentRequestId =
            fullfillmentRequestIds[index];
          offerDetailsInJson2.fulfillmentRequestExpiryTime =
            fullfillmentResult.settlementRequest.expiryTime;
          offerDetailsInJson2.fulfillmentRequestQuantityRequested =
            quantityRequested;

          // offerDetailsInJson2.fulfillmentRequestsettled =
          //   fullfillmentResult.settlementRequest.settled;
          offerDetailsInJson2.fulfillmentRequestfulfilledTime =
            fullfillmentResult.settlementRequest.settledTime;

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
  settlementRequestId: string
) => {
  try {
    if (!trustLex) return undefined;

    let settlementRequest: SettlementRequest =
      await trustLex.initializedSettlements(offerId, settlementRequestId);

    return settlementRequest;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getInitializedFulfillmentsByOfferId = async (
  trustLex: ethers.Contract | undefined,
  offerId: number,
  walletName: string
) => {
  let fullfillmentResult: IResultSettlementRequest[] = [];
  try {
    if (!trustLex) return false;

    let fullfillmentResult = [];
    if (walletName == "metamask") {
      fullfillmentResult = await trustLex.getInitiatedSettlements(offerId);
    }
    if (walletName == "wallet_connect") {
      fullfillmentResult = await trustLex.read.getInitiatedSettlements([
        offerId,
      ]);
    }

    // console.log(fullfillmentResult);
    return fullfillmentResult;
  } catch (error) {
    console.log(error);
    return fullfillmentResult;
  }
};
export const initiateSettlementService = async (
  trustLex: ethers.Contract | undefined,
  offerId: string,
  _settlement: SettlementRequest,
  proof: IBitcoinPaymentProof
) => {
  try {
    if (!trustLex) return false;
    console.log(offerId, _settlement, proof);
    const initializeFullfillment = await trustLex.initiateSettlement(
      offerId,
      _settlement,
      proof
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

export const finalizeSettlement = async (
  trustLex: ethers.Contract | undefined,
  offerId: string,
  htlcDetails: HTLCDetail
) => {
  try {
    if (!trustLex) return false;
    console.log(offerId, htlcDetails);
    const transaction = await trustLex.finalizeSettlement(offerId, [
      htlcDetails.secret,
    ]);

    let tx = await transaction.wait();
    return tx;
  } catch (error: any) {
    console.log(error?.message ? error.message : error);
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

export const cancelOfferService = async (
  trustLex: ethers.Contract | undefined,
  offerId: string
) => {
  try {
    if (!trustLex) return false;
    const transaction = await trustLex.cancelOffer(offerId);

    let tx = await transaction.wait();
    return tx;
  } catch (error: any) {
    console.log(error?.message);
    console.log(error);
    return false;
  }
};

export const getClaimPeriod = async (trustLex: ethers.Contract | false) => {
  try {
    if (!trustLex) return false;

    let CLAIM_PERIOD: number = await trustLex.CLAIM_PERIOD();
    return CLAIM_PERIOD;
  } catch (error) {
    console.log(error);
    return false;
  }
};
