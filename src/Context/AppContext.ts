import { createContext } from "react";

export const AppContext = createContext<null | {
  account: string;
  setAccount: React.Dispatch<React.SetStateAction<string>>;
}>(null);
