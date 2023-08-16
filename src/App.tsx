//------------Import for wallet connect -----------------//
// import "wagmi/window";
import { useWeb3Modal, Web3Button } from "@web3modal/react";
import {} from "@web3modal/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { fetchBalance, getNetwork } from "@wagmi/core";
import { usePublicClient } from "wagmi";
import { useWalletClient } from "wagmi";

//------------End Import for wallet connect -----------------//

import { MantineProvider } from "@mantine/core";
import Layout from "./components/Layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Earn from "~/pages/Earn/Earn";
import Home from "~/pages/Home/Home";
import Exchange from "~/pages/Exchange/Exchange";
import Recent from "./pages/Recent/Recent";
import { BaseContext } from "~/Context/BaseContext";
import { AppContext } from "./Context/AppContext";
import { useState, useEffect, useContext } from "react";
import {
  connect as connectService,
  findMetaMaskAccount,
  getBalance,
  getOffersList,
  getTotalOffers,
  getERC20TokenBalance,
  listInitializeFullfillmentOnGoingByNonEvent,
  listInitializeFullfillmentCompletedByNonEvent,
  showErrorMessage,
  showSuccessMessage,
  createContractInstance,
  getEventData,
  isMetamaskConnectedService,
  connectToMetamask,
} from "./service/AppService";
import {
  ethereum as WalletConnectEthereum,
  createContractInstanceWalletService,
  createContractInstanceWagmi,
  writeContractWagmi,
  readContractWagmi,
  getEventDataWagmi,
  watchContractEventWagmi,
  fetchBalanceWagmi,
} from "./service/WalletConnectService";

import IUserInputData from "./interfaces/IUserInputData";
import { INetworkInfo } from "./interfaces/INetworkInfo";
import swapArrayElements from "./utils/swapArray";
import { formatERC20Tokens, tofixedEther } from "./utils/Ether.utills";
import { IBTCWallet } from "./utils/BitcoinUtils";
import { BitcoinNodeEnum } from "./interfaces/IBitcoinNode";
import { IConnectInfo } from "./interfaces/INetworkInfo";
import {
  IListenedOfferData,
  IOffersResult,
  IinitiatedFullfillmentResult,
  IOffersResultByNonEvent,
  OrderBy,
  IListInitiatedFullfillmentDataByNonEvent,
  IInitiatedOrder,
} from "./interfaces/IOfferdata";
import { ethers } from "ethers";
import { ContractMap } from "./Context/AppConfig";
import useLocalstorage from "./hooks/useLocalstorage";
import {
  PAGE_SIZE,
  activeExchange,
  currencyObjects,
  DEFAULT_NETWORK,
  DEFAULT_IS_NATIVE_TOKEN,
  NetworkInfo,
  DEFAULT_TOKEN,
  BTCRecievedFromLastHours,
} from "~/Context/Constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { number } from "bitcoinjs-lib/src/script";
import Alert from "./components/Alerts/Alert";
import ProtocolDocs from "./pages/Protocol/protocol";

interface ConnectInfo {
  chainId: string;
}

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

const DefaultPage = () => {
  // const { ethereum } = window;
  // if (!ethereum) {
  //   return <ProtocolDocs />;
  // }
  return <Home />;
};

export default function App() {
  const { ethereum: MetamaskEthereum } = window;
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const { address, isConnected, isDisconnected } = useAccount();
  // const provider = useProvider(...)
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  // console.log(walletClient);
  const [connectInfo, setConnectinfo] = useState<IConnectInfo>({
    isConnected: isConnected == true || isMetamaskConnected == true,
    walletName:
      isConnected == true
        ? "wallet_connect"
        : isMetamaskConnected == true
        ? "metamask"
        : "",
    ethereumObject: isConnected == true ? publicClient : MetamaskEthereum,
  });
  const [account, setAccount] = useState(address ? address : "");
  const [balance, setBalance] = useState("");
  const [contract, setContract] = useState<ethers.Contract>();

  useEffect(() => {
    (async () => {
      // const balance2 = await fetchBalance({
      //   address: "0xF85acc0C5b6d42Cd40B3F798E8e85b41597A5450",
      // });
      // console.log(balance2);
      let isMetamaskConnected = await isMetamaskConnectedService();
      console.log(isMetamaskConnected);
      let account = await connectToMetamask();

      setIsMetamaskConnected(isMetamaskConnected);
      if (isMetamaskConnected == true) {
        setConnectinfo({
          isConnected: true,
          walletName: "metamask",
          ethereumObject: MetamaskEthereum,
        });
        setAccount(account);
      }
      // console.log("connectInfo", connectInfo);
    })();
  }, []);

  // console.log("address", address);
  // console.log("isConnected", isConnected);

  const { connect, connectors, error, isLoading, pendingConnector, data } =
    useConnect({
      connector: new InjectedConnector(),
    });

  const { disconnect } = useDisconnect();
  const { chain, chains } = getNetwork();

  // session established
  useEffect(() => {
    if (isConnected) {
      console.log("WalletConnect connect hook emited");

      setConnectinfo({
        ...connectInfo,
        isConnected: true,
        walletName: "wallet_connect",
      });
    }
  }, [isConnected]);
  useEffect(() => {
    if (isDisconnected) {
      if (connectInfo.walletName != "metamask") {
        console.log("WalletConnect disconnect hook emited");
        setConnectinfo({
          ...connectInfo,
          isConnected: false,
          walletName: "",
        });
      }
    }
  }, [isDisconnected]);

  if (MetamaskEthereum) {
    // metamask disconnect event
    (MetamaskEthereum as any).on("disconnect", (error: ProviderRpcError) => {
      console.log("Metamask event disconnect fired");
      setConnectinfo({
        ...connectInfo,
        isConnected: false,
        walletName: "",
      });
    });
    (MetamaskEthereum as any).on("connect", (connectInfo: ConnectInfo) => {
      console.log("Metamask event disconnect fired");
      setConnectinfo({
        ...connectInfo,
        isConnected: true,
        walletName: "metamask",
      });
    });
  }
  return (
    <>
      <BaseContext.Provider
        value={{
          isMetamaskConnected,
          connectInfo,
          setConnectinfo,
          account,
          setAccount,
          balance,
          setBalance,
          contract,
          setContract,
        }}
      >
        {/* <Web3Button /> */}
        {connectInfo.isConnected == true ? (
          <>
            {" "}
            <BaseApp />
          </>
        ) : (
          <>
            <MantineProvider
              theme={{ colorScheme: "dark" }}
              withGlobalStyles
              withNormalizeCSS
            >
              <ProtocolDocs />
            </MantineProvider>
          </>
        )}
      </BaseContext.Provider>
    </>
  );
}

export function BaseApp() {
  const context = useContext(BaseContext);
  if (context === null) {
    return <>Loading...</>;
  }
  const {
    isMetamaskConnected,
    connectInfo,
    setConnectinfo,
    account,
    setAccount,
    balance,
    setBalance,
    contract,
    setContract,
  } = context;

  const { get, set, remove } = useLocalstorage();
  // const [account, setAccount] = useState("");
  // const [balance, setBalance] = useState("");
  const [totalOffers, setTotalOffers] = useState(0);
  const [fromOfferId, setFromOfferId] = useState(0);
  // const [contract, setContract] = useState<ethers.Contract>();
  const tokenData = get("selectedToken", false);
  const selectedBitcoinNode_ = get("selectedBitcoinNode", false);
  const [selectedToken, setSelectedToken] = useState(
    tokenData ? tokenData.toUpperCase() : DEFAULT_TOKEN
  );
  const [selectedBitcoinNode, setSelectedBitcoinNode] = useState<string>(
    selectedBitcoinNode_ ? selectedBitcoinNode_ : BitcoinNodeEnum.TrustlexNode
  );
  // console.log(BitcoinNodeEnum.TrustlexNode);
  const [erc20balance, setERC20balance] = useState("");
  const [erc20TokenContract, setERC20TokenContract] =
    useState<ethers.Contract>();

  const [listenedOfferData, setListenedOfferData] = useState<IOffersResult>({
    fromBlock: 0,
    toBlock: 0,
    offers: [],
  });
  const [isMoreTableDataLoading, setMoreTableDataLoading] = useState(true);
  const [exchangeLoadingText, setExchangeLoadingText] = useState<string>(
    "Connecting to Network"
  );
  const [refreshOffersListKey, setRefreshOffersListKey] = useState<number>(1);

  // variable for current user bitcoin balance
  const [BTCBalance, setBTCBalance] = useState(0);
  const btcWalletDataLocal = get("btcWalletData", false);
  const [btcWalletData, setBTCWalletData] = useState<IBTCWallet | undefined>(
    btcWalletDataLocal ? JSON.parse(btcWalletDataLocal) : undefined
  );

  //Start My Swap ongoing variable
  const [
    isMoreMySwapOngoinTableDataLoading,
    setIsMoreMySwapOngoinTableDataLoading,
  ] = useState(true);
  const [mySwapOngoingLoadingText, setMySwapOngoingLoadingText] =
    useState<string>("Connecting to Network");
  const [mySwapOngoingfromOfferId, setMySwapOngoingfromOfferId] = useState(0);

  const [listenedOfferDataByNonEvent, setListenedOfferDataByNonEvent] =
    useState<IOffersResultByNonEvent>({
      offers: [],
    });

  const [refreshMySwapOngoingListKey, setRefreshMySwapOngoingListKey] =
    useState<number>(1);
  const [
    listenedOngoinMySwapOnGoingDataByNonEvent,
    setlistenedOngoinMySwapOnGoingDataByNonEvent,
  ] = useState<IListInitiatedFullfillmentDataByNonEvent[]>([]);
  const [listenedOngoinMySwapData, setlistenedOngoinMySwapData] =
    useState<IinitiatedFullfillmentResult>({
      fromBlock: 0,
      toBlock: 0,
      offers: [],
    });

  //End My Swap ongoing variable

  //Start My Swap completed variable
  const [
    isMoreMySwapCompletedTableDataLoading,
    setIsMoreMySwapCompletedTableDataLoading,
  ] = useState(true);
  const [mySwapCompletedLoadingText, setMySwapCompletedLoadingText] =
    useState<string>("Connecting to Network");
  const [mySwapCompletedfromOfferId, setMySwapCompletedfromOfferId] =
    useState(0);

  const [
    listenedMySwapCompletedDataByNonEvent,
    setListenedMySwapCompletedDataByNonEvent,
  ] = useState<IListInitiatedFullfillmentDataByNonEvent[]>([]);

  const [refreshMySwapCompletedListKey, setRefreshMySwapCompletedListKey] =
    useState<number>(1);
  //End My Swap completed variable

  //Start My Swap completed variable for all account
  const [
    isMoreMySwapAllCompletedTableDataLoading,
    setIsMoreMySwapAllCompletedTableDataLoading,
  ] = useState(true);
  const [mySwapAllCompletedLoadingText, setMySwapAllCompletedLoadingText] =
    useState<string>("Connecting to Network");
  const [mySwapAllCompletedfromOfferId, setMySwapAllCompletedfromOfferId] =
    useState(0);

  const [
    listenedMySwapAllCompletedDataByNonEvent,
    setListenedMySwapAllCompletedDataByNonEvent,
  ] = useState<IListInitiatedFullfillmentDataByNonEvent[]>([]);

  const [
    refreshMySwapAllCompletedListKey,
    setRefreshMySwapAllCompletedListKey,
  ] = useState<number>(1);
  //End My Swap completed variable all account

  //variable for current network in metamask
  const [netWorkInfoData, setNetWorkInfoData] = useState<INetworkInfo>({
    name: "",
    chainId: 0,
  });
  const userData = get("userInputData", true);

  const [userInputData, setUserInputData] = useState<IUserInputData>(
    userData
      ? userData
      : {
          setLimit: true,
          limit: "",
          activeExchange: filteredActiveExchange(DEFAULT_NETWORK),
          selectedNetwork: DEFAULT_NETWORK,
          isNativeToken: DEFAULT_IS_NATIVE_TOKEN,
        }
  );

  const initiatedOrdersLocalStoarge = get("initiatedOrders", false);
  // console.log(initiatedOrdersLocalStoarge);

  let initiatedOrders_ =
    initiatedOrdersLocalStoarge != false
      ? JSON.parse(initiatedOrdersLocalStoarge)
      : [];
  const [initiatedOrders, setInitiatedOrders] =
    useState<IInitiatedOrder[]>(initiatedOrders_);

  const [selectedNetwork, setSelectedNetwork] = useState<string>(
    userData.selectedNetwork !== undefined
      ? userData?.selectedNetwork
      : DEFAULT_NETWORK
  );
  const [alertMessage, setAlertMessage] = useState<string | JSX.Element>("");
  const [alertOpen, setAlertOpen] = useState<number>(0);

  // use effect for BTC balance
  useEffect(() => {
    (async () => {
      setBTCBalance(0);

      let fromLastHours = BTCRecievedFromLastHours;
      let receivedByAddress = account;
      let ethereumObject = connectInfo.ethereumObject;
      if (receivedByAddress != "") {
        let BTCBalance = 0;
        if (connectInfo.walletName == "metamask") {
          let contractInstance = await getSelectedTokenContractInstance();
          BTCBalance = await getEventData(
            contractInstance as ethers.Contract,
            fromLastHours,
            receivedByAddress,
            ethereumObject
          );
        } else if (connectInfo.walletName == "wallet_connect") {
          let contractAddress =
            currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
              .orderBookContractAddreess;
          let contractABI =
            currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
              .orderBookContractABI;
          let contractInstance =
            await getSelectedTokenWalletConnectSignerContractInstance();
          // BTCBalance = await getEventDataWagmi(
          //   contractInstance as ethers.Contract,
          //   fromLastHours,
          //   receivedByAddress,
          //   ethereumObject,
          //   contractAddress,
          //   contractABI
          // );
          BTCBalance = 0;
        }

        // console.log(BTCBalance);
        setBTCBalance(BTCBalance);
      }
    })();
  }, [userInputData.selectedNetwork, account]);

  useEffect(() => {
    // on network change update below
    set("userInputData", userInputData);
    const userData = get("userInputData", true);
    // console.log(userInputData, userData);
  }, [userInputData.selectedNetwork]);

  // useEffect(() => {
  //   let setSelectedToken_ =
  //     userInputData.activeExchange[1].currency.toUpperCase();
  //   console.log(setSelectedToken_);
  //   set(
  //     "selectedToken",
  //     // if you have multiple token address in AppConfig.tsx,
  //     // you can use this line instead of ETH
  //     // this line throws error if all the activeExchange are not in AppConfig.tsx

  //     setSelectedToken_
  //     // "ETH"
  //   );
  //   setSelectedToken(setSelectedToken_);
  // }, [userInputData.activeExchange]);

  useEffect(() => {
    setTimeout(() => {
      set("selectedToken", selectedToken);
      let tokenData = get("selectedToken", false);
    }, 800);
  }, [selectedToken]);

  // use Effect for setting the selected bitcoin node in local storage
  useEffect(() => {
    set("selectedBitcoinNode", selectedBitcoinNode);
    let selectedBitcoinNode_ = get("selectedBitcoinNode", false);
  }, [selectedBitcoinNode]);

  // use Effect for setting the bitcoin wallet data in local storage
  useEffect(() => {
    if (btcWalletData) {
      set("btcWalletData", btcWalletData);
    }
  }, [btcWalletData]);

  // use Effect for change in user initiated order
  useEffect(() => {
    // console.log(initiatedOrders);
    set("initiatedOrders", JSON.stringify(initiatedOrders));
  }, [initiatedOrders]);

  //Account change event

  const { ethereum } = window;
  if (connectInfo.ethereumObject) {
    // (connectInfo.ethereumObject as any).on(
    //   "accountsChanged",
    //   async function (accounts: any) {
    //     // alert("line no. 443");
    //     setAccount(accounts[0]);
    //   }
    // );
    //  Network changed event
    // (connectInfo.ethereumObject as any).on(
    //   connectInfo.walletName == "metamask" ? "networkChanged" : "chainChanged",
    //   async function (networkId: number) {
    //     // console.log(networkId);
    //     let provider = new ethers.providers.Web3Provider(
    //       connectInfo.ethereumObject
    //     );
    //     let network = await provider.getNetwork();
    //     setNetWorkInfoData(network as INetworkInfo);
    //     checkNetwork(connectInfo.ethereumObject);
    //   }
    // );
  }

  useEffect(() => {
    (async () => {
      // const { ethereum } = window;
      const ethereum = connectInfo.ethereumObject;
      if (ethereum) {
        let provider = new ethers.providers.Web3Provider(ethereum);
        let network = await provider.getNetwork();

        // setNetWorkInfoData(network as INetworkInfo);
        // checkNetwork();
      } else {
        setExchangeLoadingText("");
        setMySwapOngoingLoadingText("");
        setMySwapCompletedLoadingText("");
      }
    })();
  }, []);

  function filteredActiveExchange(defultNetwork: string = "") {
    let filteredActiveExchange = activeExchange.filter((value) => {
      let networkKey = defultNetwork != "" ? defultNetwork : selectedNetwork;
      if (value.networkKey == networkKey || value.currency == "btc") {
        return true;
      }
    });
    return filteredActiveExchange;
  }

  // The function to check whether selected network and metamask network are equal or not
  async function checkNetwork(ethereumObject: any) {
    if (!ethereumObject) return false;
    // const { ethereum } = window;
    const ethereum = ethereumObject;
    let networkId: number;
    let provider = new ethers.providers.Web3Provider(ethereum);
    let network = await provider.getNetwork();
    networkId = network.chainId;
    // alert(network);

    // let networkRPCurls = network

    let selectedNetworkChainID: number;
    selectedNetworkChainID = NetworkInfo[selectedNetwork].ChainID;
    let selectedNetworkName = NetworkInfo[selectedNetwork].NetworkName;

    // console.log(networkId, selectedNetworkChainID);
    networkId = typeof networkId === "string" ? parseInt(networkId) : networkId;

    if (networkId !== selectedNetworkChainID) {
      let messge = `You have selected the wrong network. Kindly select the ${selectedNetworkName} .`;

      setAlertMessage(messge);
      setAlertOpen(alertOpen + 1);
      // update offers list parameters

      // setTimeout(() => {
      //   setRefreshOffersListKey(refreshOffersListKey + 1);
      // }, 500);
    } else {
      setAlertMessage("");
      setAlertOpen(0);
      // update offers list parameters
      setTimeout(() => {
        setRefreshOffersListKey(refreshOffersListKey + 1);
      }, 500);
    }
  }

  const swapChange = () => {
    setUserInputData((prev) => {
      return {
        ...prev,
        activeExchange: swapArrayElements(prev.activeExchange, 0, 1),
      };
    });
  };
  const dropDownChange = (from: string, to: string) => {
    const findIndex = userInputData.activeExchange.findIndex(
      (item) => item.currency === (from || to)
    );
    if (findIndex === -1) {
      return;
    }
    setUserInputData((prev) => {
      const fromIndex = prev.activeExchange.findIndex(
        (item) => item.currency === from
      );
      const toIndex = prev.activeExchange.findIndex(
        (item) => item.currency === to
      );
      let fromItem = prev.activeExchange[fromIndex];
      // fromItem.value = "0";
      let toItem = prev.activeExchange[toIndex];
      // toItem.value = "0";

      let activeExchangeData = prev.activeExchange;
      activeExchangeData[fromIndex] = toItem;
      activeExchangeData[toIndex] = fromItem;

      return { ...prev, activeExchange: activeExchangeData };
    });
  };
  // use effect for offers list
  useEffect(() => {
    (async () => {
      // const { ethereum } = window;
      const ethereum = connectInfo.ethereumObject;
      const walletName = connectInfo.walletName;

      if (walletName == "metamask" && ethereum != undefined) {
        setMoreTableDataLoading(false);
        setExchangeLoadingText("");
        setListenedOfferDataByNonEvent({ offers: [] });

        const provider = new ethers.providers.Web3Provider(ethereum);
        // checking the network
        let network = await provider.getNetwork();
        let networkId = network.chainId;
        networkId =
          typeof networkId === "string" ? parseInt(networkId) : networkId;

        if (networkId !== NetworkInfo[selectedNetwork].ChainID) {
          return;
        }
      } else if (walletName == "metamask") {
        showErrorMessage(
          "Unable to connect to Web3 wallet! Please install Metamask to continue"
        );
        setExchangeLoadingText("");
        setMySwapOngoingLoadingText("");
        setMySwapCompletedLoadingText("");
        return;
      }
      // console.log("ok");
      setMoreTableDataLoading(true);
      setExchangeLoadingText("Connecting to the Network!");

      // update the eth balance
      // let account = await findMetaMaskAccount();
      updateAccountBalance(account);
      // console.log(ContractMap);
      // let trustlex = await connect(
      //   provider,
      //   // ContractMap[selectedToken].address
      //   currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
      //     .orderBookContractAddreess as string
      // );
      let trustlex = await getSelectedTokenContractInstance();

      if (trustlex) {
        setContract(trustlex as ethers.Contract);

        // const offers = await listOffers(trustlex);

        // setListenedOfferData(offers);

        setMoreTableDataLoading(true);
        setExchangeLoadingText("Loading List");
        let totalOffers = 0;
        if (connectInfo.walletName == "metamask") {
          totalOffers = await getTotalOffers(trustlex);
        }
        if (connectInfo.walletName == "wallet_connect") {
          totalOffers = await getTotalOffers(trustlex.read);
        }

        setTotalOffers(totalOffers);

        let fromOfferId = totalOffers;

        let offersList = [];
        if (connectInfo.walletName == "metamask") {
          offersList = await getOffersList(
            trustlex,
            fromOfferId,
            connectInfo.walletName
          );
        }
        if (connectInfo.walletName == "wallet_connect") {
          offersList = await getOffersList(
            trustlex,
            fromOfferId,
            connectInfo.walletName
          );
        }
        // console.log(offersList);
        fromOfferId = fromOfferId - PAGE_SIZE > 0 ? fromOfferId - PAGE_SIZE : 0;
        setFromOfferId(fromOfferId);

        setListenedOfferDataByNonEvent(offersList);
        setMoreTableDataLoading(false);
        setExchangeLoadingText("");

        // fetch the recent orders my swaps ongoing by event
        // const InitializeFullfillmentData = await listInitializeFullfillment(
        //   trustlex
        // );
        // // console.log(InitializeFullfillmentData);
        // setlistenedOngoinMySwapData(InitializeFullfillmentData);
      }
      // update the token balance
      let isNativeToken =
        currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
          .isNativeToken;
      // update the token balance
      if (isNativeToken == false) {
        let ERC20Address = currencyObjects[selectedNetwork][
          selectedToken.toLowerCase()
        ].ERC20Address as string;
        let ERC20ABI =
          currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
            .ERC20ABI;
        updateTokenBalance(account, ERC20Address, ERC20ABI);
      }
    })();
  }, [refreshOffersListKey, account, selectedToken]);

  // Do the activity on account changed
  useEffect(() => {
    (async () => {
      try {
        const ethereum = connectInfo.ethereumObject;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);

          //checking the network
          let network = await provider.getNetwork();
          let networkId = network.chainId;
          networkId =
            typeof networkId === "string" ? parseInt(networkId) : networkId;

          if (networkId !== NetworkInfo[selectedNetwork].ChainID) {
            return;
          }

          let chainId = netWorkInfoData.chainId;
          // update the eth balance
          //let account = await findMetaMaskAccount();

          updateAccountBalance(account);

          if (chainId == NetworkInfo[selectedNetwork].ChainID) {
            let isNativeToken =
              currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
                .isNativeToken;
            // update the token balance
            if (isNativeToken == false) {
              let ERC20Address = currencyObjects[selectedNetwork][
                selectedToken.toLowerCase()
              ].ERC20Address as string;
              let ERC20ABI =
                currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
                  .ERC20ABI;
              updateTokenBalance(account, ERC20Address, ERC20ABI);
            }

            // update the total offers for echange page and recent my swap page
            let trustlex = await connectService(
              provider,
              // ContractMap[selectedToken].address
              currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
                .orderBookContractAddreess as string
            );
            if (trustlex) {
              let totalOffers = await getTotalOffers(
                trustlex as ethers.Contract
              );
              setTotalOffers(totalOffers);
              setMySwapOngoingLoadingText("Updating List");
              setMySwapCompletedLoadingText("Updating List");
            }
          }
        }
      } catch (err: any) {
        console.log(err);
      }
    })();
  }, [account, selectedToken]);

  // update the eth balance
  async function updateAccountBalance(account: string) {
    if (account !== null) {
      //setAccount(account);
      // console.log(connectInfo.ethereumObject);
      let balance: any = 0;
      if (connectInfo.walletName == "metamask") {
        balance = await getBalance(connectInfo.ethereumObject, account);
        balance = tofixedEther(balance).toString();
        // console.log(balance);
        setBalance(balance as string);
      } else if (connectInfo.walletName == "wallet_connect") {
        balance = await fetchBalanceWagmi(account, "eth");
        balance = tofixedEther(balance).toString();
        setBalance(balance as string);
      }
    }
  }
  // update the token balance
  async function updateTokenBalance(
    account: string,
    contractAddress: string,
    contractABI: string
  ) {
    let tokenBalance_ = await getERC20TokenBalance(
      account,
      contractAddress,
      contractABI
    );
    let tokenBalance = formatERC20Tokens(tokenBalance_);
    setERC20balance(tokenBalance);
  }
  // use effect for my swap ongoing data
  useEffect(() => {
    // update the contract info

    getSelectedTokenContractInstance().then((contract) => {
      if (contract) {
        prepareMySwapOngoingData(contract);
      }
    });
  }, [
    // totalOffers,
    refreshMySwapOngoingListKey,
    account,
    refreshOffersListKey,
    selectedToken,
  ]);

  async function prepareMySwapOngoingData(trustlex: ethers.Contract) {
    const { ethereum } = window;
    // if (ethereum) {

    setIsMoreMySwapOngoinTableDataLoading(false);
    setMySwapOngoingLoadingText("");
    setlistenedOngoinMySwapOnGoingDataByNonEvent([]);
    if (connectInfo.walletName == "metamask" && ethereum != undefined) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      let network = await provider.getNetwork();
      let networkId = network.chainId;
      networkId =
        typeof networkId === "string" ? parseInt(networkId) : networkId;

      if (networkId !== NetworkInfo[selectedNetwork].ChainID) {
        return;
      }
    }

    // create the contract instance
    let contract = await getSelectedTokenContractInstance();
    if (!contract) return false;
    setContract(contract);
    setIsMoreMySwapOngoinTableDataLoading(true);
    setMySwapOngoingLoadingText("Loading List");

    // fetch the recent orders my swaps ongoing by non event
    let totalOffers = await getTotalOffers(
      contract as ethers.Contract,
      connectInfo.walletName
    );

    setTotalOffers(totalOffers);
    let fromOfferMySwapOngoingId = totalOffers;
    const InitializeFullfillmentDataByNonEvent =
      await listInitializeFullfillmentOnGoingByNonEvent(
        contract,
        account,
        fromOfferMySwapOngoingId,
        connectInfo.walletName
      );

    setlistenedOngoinMySwapOnGoingDataByNonEvent(
      InitializeFullfillmentDataByNonEvent
    );
    fromOfferMySwapOngoingId =
      fromOfferMySwapOngoingId - PAGE_SIZE > 0
        ? fromOfferMySwapOngoingId - PAGE_SIZE
        : 0;
    setMySwapOngoingfromOfferId(fromOfferMySwapOngoingId);

    setMySwapOngoingLoadingText("");
    setIsMoreMySwapOngoinTableDataLoading(false);
    // }
  }

  useEffect(() => {
    getSelectedTokenContractInstance().then((contract) => {
      if (contract) {
        prepareMySwapCompletedData(contract);
        prepareMySwapCompletedDataForAll(contract);
      }
    });
  }, [
    // totalOffers,
    refreshMySwapCompletedListKey,
    account,
    refreshOffersListKey,
    selectedToken,
    refreshMySwapOngoingListKey,
  ]);

  async function prepareMySwapCompletedData(trustlex: ethers.Contract) {
    const { ethereum } = window;
    if (ethereum != undefined && connectInfo.walletName == "metamask") {
      const provider = new ethers.providers.Web3Provider(ethereum);
      let network = await provider.getNetwork();
      let networkId = network.chainId;
      networkId =
        typeof networkId === "string" ? parseInt(networkId) : networkId;

      if (networkId !== NetworkInfo[selectedNetwork].ChainID) {
        return;
      }
    }
    setIsMoreMySwapCompletedTableDataLoading(true);
    setMySwapCompletedLoadingText("Loading List");
    setListenedMySwapCompletedDataByNonEvent([]);

    // create the contract instance
    let contract = await getSelectedTokenContractInstance();
    if (!contract) return false;
    setContract(contract);
    // fetch the recent orders my swaps ongoing by non event
    let totalOffers = await getTotalOffers(
      contract as ethers.Contract,
      connectInfo.walletName
    );
    setTotalOffers(totalOffers);

    // fetch the recent orders my swaps ongoing by non event
    let fromOfferMySwapCompetedId = totalOffers;
    const InitializeFullfillmentDataByNonEvent =
      await listInitializeFullfillmentCompletedByNonEvent(
        contract,
        account,
        fromOfferMySwapCompetedId,
        connectInfo.walletName
      );

    setListenedMySwapCompletedDataByNonEvent(
      InitializeFullfillmentDataByNonEvent
    );
    let mySwapCompletedfromOfferId_ =
      mySwapCompletedfromOfferId - PAGE_SIZE > 0
        ? mySwapCompletedfromOfferId - PAGE_SIZE
        : 0;
    setMySwapCompletedfromOfferId(mySwapCompletedfromOfferId_);

    setMySwapCompletedLoadingText("");
    setIsMoreMySwapCompletedTableDataLoading(false);
  }

  async function prepareMySwapCompletedDataForAll(trustlex: ethers.Contract) {
    const { ethereum } = window;
    if (connectInfo.walletName == "metamask" && ethereum != undefined) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      let network = await provider.getNetwork();
      let networkId = network.chainId;
      networkId =
        typeof networkId === "string" ? parseInt(networkId) : networkId;

      if (networkId !== NetworkInfo[selectedNetwork].ChainID) {
        return;
      }
    }
    setIsMoreMySwapAllCompletedTableDataLoading(true);
    setMySwapAllCompletedLoadingText("Loading List");
    setListenedMySwapAllCompletedDataByNonEvent([]);

    // create the contract instance
    let contract = await getSelectedTokenContractInstance();
    if (!contract) return false;
    setContract(contract);
    // fetch the recent orders my swaps ongoing by non event
    let totalOffers = await getTotalOffers(
      contract as ethers.Contract,
      connectInfo.walletName
    );
    setTotalOffers(totalOffers);

    // fetch the recent orders my swaps ongoing by non event
    let fromOfferMySwapCompetedId = totalOffers;

    const InitializeFullfillmentDataByNonEvent =
      await listInitializeFullfillmentCompletedByNonEvent(
        contract,
        "",
        fromOfferMySwapCompetedId,
        connectInfo.walletName
      );

    setListenedMySwapAllCompletedDataByNonEvent(
      InitializeFullfillmentDataByNonEvent
    );
    let mySwapCompletedfromOfferId_ =
      mySwapCompletedfromOfferId - PAGE_SIZE > 0
        ? mySwapCompletedfromOfferId - PAGE_SIZE
        : 0;
    setMySwapAllCompletedfromOfferId(mySwapCompletedfromOfferId_);

    setMySwapAllCompletedLoadingText("");
    setIsMoreMySwapAllCompletedTableDataLoading(false);
  }

  async function getSelectedTokenContractInstance() {
    let contractAddress =
      currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
        .orderBookContractAddreess;
    let contractABI =
      currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
        .orderBookContractABI;
    let contract: any;
    if (connectInfo.walletName == "metamask") {
      contract = await createContractInstance(
        contractAddress as string,
        contractABI
      );
    }

    if (connectInfo.walletName == "wallet_connect") {
      // contract = await createContractInstanceWalletService(
      //   contractAddress as string,
      //   contractABI
      // );
      contract = await createContractInstanceWagmi(
        contractAddress as string,
        contractABI
      );

      // contract = contract.read;
    }
    return contract;
  }

  async function getSelectedTokenWalletConnectSignerContractInstance() {
    let contractAddress =
      currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
        .orderBookContractAddreess;
    let contractABI =
      currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
        .orderBookContractABI;
    let contract: any;
    // contract = await createContractInstanceWalletService(
    //   connectInfo.ethereumObject,
    //   contractAddress as string,
    //   contractABI
    // );
    contract = await createContractInstanceWagmi(
      contractAddress as string,
      contractABI
    );
    console.log(contract);
    // contract = contract.read;

    return contract;
  }

  async function getSelectedTokenContractandABI() {
    let contractAddress =
      currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
        .orderBookContractAddreess;
    let contractABI =
      currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
        .orderBookContractABI;
    return { contractAddress, contractABI };
  }

  async function addNetwork() {
    const { ethereum } = window;
    if (ethereum) {
      const { ethereum } = window;
      let provider = new ethers.providers.Web3Provider(ethereum);
      let network = await provider.getNetwork();
      let chainId = network.chainId;
      if (chainId == NetworkInfo[selectedNetwork].ChainID) {
        let message = `${NetworkInfo[selectedNetwork].NetworkName} is already current network`;
        showErrorMessage(message);
        return false;
      } else {
        try {
          await (ethereum as any).request({
            method: "wallet_switchEthereumChain",
            params: [
              { chainId: NetworkInfo[selectedNetwork].ChainIDHexaDecimal },
            ],
          });
        } catch (err: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (err.code === 4902) {
            let rpcUrls = [NetworkInfo[selectedNetwork].RPC_URL];
            let params = [
              {
                chainId: NetworkInfo[selectedNetwork].ChainIDHexaDecimal,
                chainName: NetworkInfo[selectedNetwork].NetworkName,
                nativeCurrency: {
                  name: NetworkInfo[selectedNetwork].NetworkName,
                  symbol: NetworkInfo[selectedNetwork].CurrencySymbol,
                  decimals: 18,
                },
                rpcUrls: rpcUrls,
                blockExplorerUrls: NetworkInfo[selectedNetwork].ExplorerUrl
                  ? [NetworkInfo[selectedNetwork].ExplorerUrl]
                  : null,
              },
            ];
            // const { ethereum } = window;
            (ethereum as any)
              .request({
                method: "wallet_addEthereumChain",
                params,
              })
              .then(() => {
                console.log("Success");
                showSuccessMessage("Network successfully changed");
                setRefreshOffersListKey(refreshOffersListKey + 1);
                setRefreshMySwapOngoingListKey(refreshMySwapOngoingListKey + 1);
                setRefreshMySwapCompletedListKey(
                  refreshMySwapCompletedListKey + 1
                );
                // setAlertMessage("");
                // setAlertOpen(0);
              })
              .catch((error: any) => {
                console.log("Error", error.message);
                showErrorMessage(error.message);
              });
          }
        }
      }
    } else {
      showErrorMessage("Unable to locate a compatible web3 browser!");
    }
  }

  return (
    <>
      <MantineProvider
        theme={{ colorScheme: "dark" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <BrowserRouter>
          <AppContext.Provider
            value={{
              balance,
              setBalance,
              account,
              setAccount,
              selectedToken,
              setSelectedToken,
              contract,
              setContract,
              userInputData,
              setUserInputData,
              swapChange,
              dropDownChange,
              listenedOfferData,
              setListenedOfferData,
              listenedOngoinMySwapData,
              setlistenedOngoinMySwapData,
              listenedOfferDataByNonEvent,
              setListenedOfferDataByNonEvent,
              isMoreTableDataLoading,
              setMoreTableDataLoading,
              exchangeLoadingText,
              setExchangeLoadingText,
              totalOffers,
              setTotalOffers,
              fromOfferId,
              setFromOfferId,
              refreshOffersListKey,
              setRefreshOffersListKey,
              erc20balance,
              setERC20balance,
              // start my swap ongoing variables
              listenedOngoinMySwapOnGoingDataByNonEvent,
              setlistenedOngoinMySwapOnGoingDataByNonEvent,
              mySwapOngoingLoadingText,
              setMySwapOngoingLoadingText,
              isMoreMySwapOngoinTableDataLoading,
              mySwapOngoingfromOfferId,
              setMySwapOngoingfromOfferId,
              refreshMySwapOngoingListKey,
              setRefreshMySwapOngoingListKey,
              // end my swap ongoing variables

              // start my swap completed variables
              listenedMySwapCompletedDataByNonEvent,
              setListenedMySwapCompletedDataByNonEvent,
              mySwapCompletedLoadingText,
              setMySwapCompletedLoadingText,
              isMoreMySwapCompletedTableDataLoading,
              mySwapCompletedfromOfferId,
              setMySwapCompletedfromOfferId,
              refreshMySwapCompletedListKey,
              setRefreshMySwapCompletedListKey,
              // end my swap completed variables

              // start my swap completed variables
              listenedMySwapAllCompletedDataByNonEvent,
              setListenedMySwapAllCompletedDataByNonEvent,
              mySwapAllCompletedLoadingText,
              setMySwapAllCompletedLoadingText,
              isMoreMySwapAllCompletedTableDataLoading,
              mySwapAllCompletedfromOfferId,
              setMySwapAllCompletedfromOfferId,
              refreshMySwapAllCompletedListKey,
              setRefreshMySwapAllCompletedListKey,
              getSelectedTokenContractInstance,
              // end my swap completed variables
              selectedNetwork,
              setSelectedNetwork,
              checkNetwork,

              //alert variables
              alertOpen,
              setAlertOpen,
              alertMessage,
              setAlertMessage,
              selectedBitcoinNode,
              setSelectedBitcoinNode,
              // BTC balance context variable
              BTCBalance,
              setBTCBalance,
              //BTC Wallet data variables
              btcWalletData,
              setBTCWalletData,
              initiatedOrders,
              setInitiatedOrders,

              isMetamaskConnected,
              connectInfo,
              setConnectinfo,
              getSelectedTokenContractandABI,
              getSelectedTokenWalletConnectSignerContractInstance,
            }}
          >
            <Layout>
              <ToastContainer />
              {alertMessage != "" ? (
                <>
                  <Alert
                    message={alertMessage}
                    setAlertMessage={setAlertMessage}
                    isOpened={alertOpen}
                    setAlertOpen={setAlertOpen}
                    addNetwork={addNetwork}
                  />
                </>
              ) : (
                ""
              )}

              <Routes>
                <Route path="/" element={<DefaultPage />} />
                <Route path="/exchange" element={<Exchange />} />
                <Route path="/recent" element={<Recent />} />
                <Route path="/earn" element={<Earn />} />

                <Route path="/protocol" element={<ProtocolDocs />} />
              </Routes>
            </Layout>
          </AppContext.Provider>
        </BrowserRouter>
      </MantineProvider>
    </>
  );
}
