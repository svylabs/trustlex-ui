import { Wallet, ethers } from "ethers";
import { tofixedBTC } from "~/utils/BitcoinUtils";

// https://docs.chain.link/data-feeds/price-feeds/addresses
// const provider = new ethers.providers.JsonRpcProvider(
//   "https://eth.getblock.io/d924a382-ab7c-4649-b4eb-0f731b9a100e/mainnet/"
// );

const aggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
    name: "getRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export const getPriceRate = async (contractAddres: string) => {
  if (typeof window.ethereum !== undefined) {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const priceFeed = new ethers.Contract(
        contractAddres,
        aggregatorV3InterfaceABI,
        provider
      );

      const roundData: any = await priceFeed.latestRoundData();
      // Do something with roundData
      const { answer } = roundData;
      let ETHToUSD = answer / 10 ** 8;
      //   console.log("ETHToUSD", ETHToUSD);
      return ETHToUSD;
    } catch (err) {
      console.log(err);
      return 0;
    }
  } else {
    console.log("Web3 injected provider is not found !");
    return 0;
  }
};
