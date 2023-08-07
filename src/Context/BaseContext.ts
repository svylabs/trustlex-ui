import { createContext } from "react";

import { IConnectInfo } from "~/interfaces/INetworkInfo";

export const BaseContext = createContext<null | {
  connectInfo: IConnectInfo;
  setConnectinfo: (connectInfo: IConnectInfo) => void;
}>(null);
