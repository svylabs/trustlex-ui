import { createContext } from "react";
import { ethers } from "ethers";
import { IConnectInfo } from "~/interfaces/INetworkInfo";

export const BaseContext = createContext<null | {
  connectInfo: IConnectInfo;
  setConnectinfo: (connectInfo: IConnectInfo) => void;
  account: string;
  setAccount: React.Dispatch<React.SetStateAction<string>>;
  balance: string;
  setBalance: React.Dispatch<React.SetStateAction<string>>;
  contract: ethers.Contract | undefined;
  setContract: React.Dispatch<
    React.SetStateAction<ethers.Contract | undefined>
  >;
}>(null);
