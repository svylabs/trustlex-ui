import { Wallet, ethers } from "ethers";
import { tofixedBTC } from "~/utils/BitcoinUtils";
import { IConnectInfo } from "~/interfaces/INetworkInfo";
import { createContractInstanceWagmi } from "~/service/WalletConnectService";
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

export const getPriceRate = async (
  contractAddres: string,
  connectInfo: IConnectInfo
) => {
  try {
    let priceFeed: any;
    let roundData: any;

    if (
      connectInfo.walletName == "metamask" &&
      connectInfo.ethereumObject != undefined
    ) {
      const ethereum: any = connectInfo.ethereumObject;
      const provider = new ethers.providers.Web3Provider(ethereum);
      priceFeed = new ethers.Contract(
        contractAddres,
        aggregatorV3InterfaceABI,
        provider
      );

      roundData = await priceFeed.latestRoundData();

      const { answer } = roundData;
      let ETHToUSD = answer / 10 ** 8;
      //   console.log("ETHToUSD", ETHToUSD);
      return ETHToUSD;
    } else if (connectInfo.walletName == "wallet_connect") {
      priceFeed = await createContractInstanceWagmi(
        contractAddres as string,
        aggregatorV3InterfaceABI
      );
      // console.log(priceFeed, contractAddres, aggregatorV3InterfaceABI);
      roundData = await priceFeed.read.latestRoundData();

      const answer = roundData.length > 0 ? Number(roundData[1]) : 0;
      let ETHToUSD = answer / 10 ** 8;
      //   console.log("ETHToUSD", ETHToUSD);
      return ETHToUSD;
    } else {
      console.log("Web3 injected provider is not found !");
      return 0;
    }
  } catch (err) {
    console.log(err);
    return 0;
  }
};
