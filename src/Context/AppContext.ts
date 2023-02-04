import { createContext } from "react";
import IUserInputData from "~/interfaces/IUserInputData";

export const AppContext = createContext<null | {
  account: string;
  setAccount: React.Dispatch<React.SetStateAction<string>>;
  userInputData: IUserInputData;
  setUserInputData: React.Dispatch<React.SetStateAction<IUserInputData>>;
  swapChange: Function;
  dropDownChange: (from: string, to: string) => void;
}>(null);
