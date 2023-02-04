interface IActiveExchange {
  currency: string;
  value: string;
}

export default interface IUserInputData {
  setLimit: boolean;
  limit: string;
  activeExchange: IActiveExchange[];
}
