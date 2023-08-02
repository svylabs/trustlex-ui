import React from "react";
import { Wallet, ethers } from "ethers";
import { EthereumClient } from "@web3modal/ethereum";

export interface IEthereumClient {
  _ethereumClient: EthereumClient;
}
export class WalletConnectService {
  ethereumClient: EthereumClient;
  constructor({ _ethereumClient }: IEthereumClient) {
    this.ethereumClient = _ethereumClient;
  }
  getEthereumProvider = () => this.ethereumClient;

  getBalance = async (address: string) => {
    try {
      let provider = this.getEthereumProvider();
      let balance: any = await provider.fetchBalance(address);
      balance = +ethers.utils.formatEther(balance);
      return balance;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };
}
