import { createContext } from "react";
import {
  IListenedOfferData,
  IOffersResult,
  IinitiatedFullfillmentResult,
  IOffersResultByNonEvent,
} from "~/interfaces/IOfferdata";
import { ethers } from "ethers";

import IUserInputData from "~/interfaces/IUserInputData";

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
  toast: any;
}>(null);
