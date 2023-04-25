import { ethers } from "ethers";

export const EthtoWei = (eth: string) => {
  const wei = ethers.utils.parseEther(eth);
  return wei.toString();
};

export const WeitoEth = (wei: string) => {
  const eth = ethers.utils.formatEther(wei);
  return eth;
};
