interface IActiveExchange {
  currency: string;
  value: string;
  networkName: string;
  networkKey: string;
  isNativeToken: boolean;
}

export default interface IUserInputData {
  setLimit: boolean;
  limit: string;
  activeExchange: IActiveExchange[];
  selectedNetwork: string;
}
