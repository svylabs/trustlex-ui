import { createContext } from "react";
import { IListenedOfferData } from "~/interfaces/IOfferdata";
import {ethers} from 'ethers';

import IUserInputData from "~/interfaces/IUserInputData";

export const AppContext = createContext<null | {
  contract: ethers.Contract | undefined;
  setContract: React.Dispatch<React.SetStateAction<ethers.Contract | undefined>>;
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
  listenedOfferData: IListenedOfferData[] | [];
  setListenedOfferData: React.Dispatch<
    React.SetStateAction<[] | IListenedOfferData[]>
  >;
}>(null);
