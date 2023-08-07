export interface INetworkInfo {
  name: string;
  chainId: number;
}

export interface IConnectInfo {
  isConnected: boolean;
  walletName: string;
  ethereumObject?: any;
  provider?: any;
}
