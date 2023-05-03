import { ethers } from "ethers";
import { TOKEN_DECIMAL_PLACE } from "~/Context/Constants";

export const EthtoWei = (eth: string) => {
  const wei = ethers.utils.parseEther(eth);
  return wei.toString();
};

export const WeitoEth = (wei: string) => {
  const eth = ethers.utils.formatEther(wei);
  return eth;
};

export const formatERC20Tokens = (amount: number) => {
  return amount.toFixed(TOKEN_DECIMAL_PLACE);
};
