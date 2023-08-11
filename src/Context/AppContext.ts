import { createContext } from "react";
import {
  IListenedOfferData,
  IOffersResult,
  IinitiatedFullfillmentResult,
  IOffersResultByNonEvent,
  IListInitiatedFullfillmentDataByNonEvent,
  IInitiatedOrder,
} from "~/interfaces/IOfferdata";
import { IConnectInfo } from "~/interfaces/INetworkInfo";
import { ethers } from "ethers";

import IUserInputData from "~/interfaces/IUserInputData";
import { IBTCWallet } from "~/utils/BitcoinUtils";

export const AppContext = createContext<null | {
  contract: ethers.Contract | undefined;
  setContract: React.Dispatch<
    React.SetStateAction<ethers.Contract | undefined>
  >;
  selectedToken: string;
  setSelectedToken: React.Dispatch<React.SetStateAction<string>>;
  account: string;
  setAccount: React.Dispatch<React.SetStateAction<string>>;
  balance: string;
  setBalance: React.Dispatch<React.SetStateAction<string>>;
  userInputData: IUserInputData;
  setUserInputData: React.Dispatch<React.SetStateAction<IUserInputData>>;
  swapChange: Function;
  dropDownChange: (from: string, to: string) => void;
  listenedOfferData: IOffersResult;
  setListenedOfferData: React.Dispatch<React.SetStateAction<IOffersResult>>;

  listenedOfferDataByNonEvent: IOffersResultByNonEvent;
  setListenedOfferDataByNonEvent: React.Dispatch<
    React.SetStateAction<IOffersResultByNonEvent>
  >;

  listenedOngoinMySwapData: IinitiatedFullfillmentResult;
  setlistenedOngoinMySwapData: React.Dispatch<
    React.SetStateAction<IinitiatedFullfillmentResult>
  >;

  listenedOngoinMySwapOnGoingDataByNonEvent: IListInitiatedFullfillmentDataByNonEvent[];
  setlistenedOngoinMySwapOnGoingDataByNonEvent: React.Dispatch<
    React.SetStateAction<IListInitiatedFullfillmentDataByNonEvent[]>
  >;

  isMoreTableDataLoading: boolean;
  setMoreTableDataLoading: React.Dispatch<React.SetStateAction<boolean>>;

  exchangeLoadingText: string;
  setExchangeLoadingText: React.Dispatch<React.SetStateAction<string>>;

  totalOffers: number;
  setTotalOffers: React.Dispatch<React.SetStateAction<number>>;

  fromOfferId: number;
  setFromOfferId: React.Dispatch<React.SetStateAction<number>>;
  refreshOffersListKey: number;
  setRefreshOffersListKey: React.Dispatch<React.SetStateAction<number>>;
  erc20balance: string;
  setERC20balance: React.Dispatch<React.SetStateAction<string>>;

  mySwapOngoingLoadingText: string;
  setMySwapOngoingLoadingText: React.Dispatch<React.SetStateAction<string>>;
  isMoreMySwapOngoinTableDataLoading: boolean;
  mySwapOngoingfromOfferId: number;
  setMySwapOngoingfromOfferId: React.Dispatch<React.SetStateAction<number>>;
  refreshMySwapOngoingListKey: number;
  setRefreshMySwapOngoingListKey: React.Dispatch<React.SetStateAction<number>>;

  listenedMySwapCompletedDataByNonEvent: IListInitiatedFullfillmentDataByNonEvent[];
  setListenedMySwapCompletedDataByNonEvent: React.Dispatch<
    React.SetStateAction<IListInitiatedFullfillmentDataByNonEvent[]>
  >;
  mySwapCompletedLoadingText: string;
  setMySwapCompletedLoadingText: React.Dispatch<React.SetStateAction<string>>;
  isMoreMySwapCompletedTableDataLoading: boolean;
  mySwapCompletedfromOfferId: number;
  setMySwapCompletedfromOfferId: React.Dispatch<React.SetStateAction<number>>;
  refreshMySwapCompletedListKey: number;
  setRefreshMySwapCompletedListKey: React.Dispatch<
    React.SetStateAction<number>
  >;

  listenedMySwapAllCompletedDataByNonEvent: IListInitiatedFullfillmentDataByNonEvent[];
  setListenedMySwapAllCompletedDataByNonEvent: React.Dispatch<
    React.SetStateAction<IListInitiatedFullfillmentDataByNonEvent[]>
  >;
  mySwapAllCompletedLoadingText: string;
  setMySwapAllCompletedLoadingText: React.Dispatch<
    React.SetStateAction<string>
  >;
  isMoreMySwapAllCompletedTableDataLoading: boolean;
  mySwapAllCompletedfromOfferId: number;
  setMySwapAllCompletedfromOfferId: React.Dispatch<
    React.SetStateAction<number>
  >;
  refreshMySwapAllCompletedListKey: number;
  setRefreshMySwapAllCompletedListKey: React.Dispatch<
    React.SetStateAction<number>
  >;
  getSelectedTokenContractInstance: () => Promise<ethers.Contract | false>;
  selectedNetwork: string;
  setSelectedNetwork: (selectedNetwork: string) => void;
  checkNetwork: (ethereumObject: any) => void;
  alertOpen: number;
  setAlertOpen: (alertOpen: number) => void;
  alertMessage: string | JSX.Element;
  setAlertMessage: (alertMessage: string) => void;
  selectedBitcoinNode: string;
  setSelectedBitcoinNode: (selectedBitcoinNode: string) => void;
  BTCBalance: number;
  setBTCBalance: (BTCBalance: number) => void;

  btcWalletData: IBTCWallet | undefined;
  setBTCWalletData: (btcWalletData: IBTCWallet | undefined) => void;
  initiatedOrders: IInitiatedOrder[];
  setInitiatedOrders: (initiatedOrders: IInitiatedOrder[]) => void;
  isMetamaskConnected: boolean;
  connectInfo: IConnectInfo;
  setConnectinfo: (connectInfo: IConnectInfo) => void;
  getSelectedTokenContractandABI: () => Promise<{
    contractAddress: string | undefined;
    contractABI: string | false;
  }>;
  getSelectedTokenWalletConnectSignerContractInstance: () => Promise<
    ethers.Contract | false
  >;
}>(null);
