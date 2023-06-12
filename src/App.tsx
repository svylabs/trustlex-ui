import { MantineProvider } from "@mantine/core";
import Layout from "./components/Layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Earn from "~/pages/Earn/Earn";
import Home from "~/pages/Home/Home";
import Exchange from "~/pages/Exchange/Exchange";
import Recent from "./pages/Recent/Recent";
import { AppContext } from "./Context/AppContext";
import { useState, useEffect } from "react";
import {
  connect,
  findMetaMaskAccount,
  getBalance,
  // listOffers,
  InitializeFullfillment,
  // listInitializeFullfillment,
  getOffersList,
  getTotalOffers,
  getERC20TokenBalance,
  listInitializeFullfillmentOnGoingByNonEvent,
  listInitializeFullfillmentCompletedByNonEvent,
  showErrorMessage,
  showSuccessMessage,
  createContractInstance,
} from "./service/AppService";
import IUserInputData from "./interfaces/IUserInputData";
import { INetworkInfo } from "./interfaces/INetworkInfo";
import swapArrayElements from "./utils/swapArray";
import { formatERC20Tokens } from "./utils/Ether.utills";
import {
  IListenedOfferData,
  IOffersResult,
  IinitiatedFullfillmentResult,
  IOffersResultByNonEvent,
  OrderBy,
  IListInitiatedFullfillmentDataByNonEvent,
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
} from "~/Context/Constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { number } from "bitcoinjs-lib/src/script";
import Alert from "./components/Alerts/Alert";

export default function App() {
  const { get, set, remove } = useLocalstorage();
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [totalOffers, setTotalOffers] = useState(0);
  const [fromOfferId, setFromOfferId] = useState(0);
  const [contract, setContract] = useState<ethers.Contract>();
  const tokenData = get("selectedToken", false);
  const [selectedToken, setSelectedToken] = useState(
    tokenData ? tokenData.toUpperCase() : DEFAULT_TOKEN
  );

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
  const [selectedNetwork, setSelectedNetwork] = useState<string>(
    userData.selectedNetwork !== undefined
      ? userData?.selectedNetwork
      : DEFAULT_NETWORK
  );
  const [alertMessage, setAlertMessage] = useState<string | JSX.Element>("");
  const [alertOpen, setAlertOpen] = useState<number>(0);

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

  //Account change event
  const { ethereum } = window;
  (ethereum as any).on("accountsChanged", async function (accounts: any) {
    setAccount(accounts[0]);
  });
  //  Network changed event
  (ethereum as any).on("networkChanged", async function (networkId: number) {
    // console.log(networkId);
    let provider = new ethers.providers.Web3Provider(ethereum);
    let network = await provider.getNetwork();
    setNetWorkInfoData(network as INetworkInfo);
    checkNetwork();
  });

  useEffect(() => {
    (async () => {
      const { ethereum } = window;
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
  async function checkNetwork() {
    const { ethereum } = window;
    let networkId: number;
    let provider = new ethers.providers.Web3Provider(ethereum);
    let network = await provider.getNetwork();
    networkId = network.chainId;

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
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        setMoreTableDataLoading(false);
        setExchangeLoadingText("");
        setListenedOfferDataByNonEvent({ offers: [] });
        // checking the network
        let network = await provider.getNetwork();
        let networkId = network.chainId;
        networkId =
          typeof networkId === "string" ? parseInt(networkId) : networkId;

        if (networkId !== NetworkInfo[selectedNetwork].ChainID) {
          return;
        }
        // console.log("ok");
        setMoreTableDataLoading(true);
        setExchangeLoadingText("Connecting to the Network!");

        // update the eth balance
        let account = await findMetaMaskAccount();
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

          let totalOffers = await getTotalOffers(trustlex);
          setTotalOffers(totalOffers);

          let fromOfferId = totalOffers;

          let offersList = await getOffersList(trustlex, fromOfferId);
          fromOfferId =
            fromOfferId - PAGE_SIZE > 0 ? fromOfferId - PAGE_SIZE : 0;
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
      } else {
        showErrorMessage("Metamask is not found ! kindly install the Metamask");
        setExchangeLoadingText("");
        setMySwapOngoingLoadingText("");
        setMySwapCompletedLoadingText("");
      }
      // return () => {
      //   setAccount("");
      //   setBalance("");
      // };
    })();
  }, [refreshOffersListKey, account, selectedToken]);

  // Do the activity on account changed
  useEffect(() => {
    (async () => {
      try {
        const { ethereum } = window;
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
          let account = await findMetaMaskAccount();
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
            let trustlex = await connect(
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
      setAccount(account);
      getBalance(account).then((balance) => {
        if (balance) {
          setBalance(balance);
        }
      });
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
    if (contract) {
      prepareMySwapOngoingData(contract);
    }
  }, [
    // totalOffers,
    refreshMySwapOngoingListKey,
    account,
    refreshOffersListKey,
    selectedToken,
  ]);

  async function prepareMySwapOngoingData(trustlex: ethers.Contract) {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      setIsMoreMySwapOngoinTableDataLoading(false);
      setMySwapOngoingLoadingText("");
      setlistenedOngoinMySwapOnGoingDataByNonEvent([]);

      let network = await provider.getNetwork();
      let networkId = network.chainId;
      networkId =
        typeof networkId === "string" ? parseInt(networkId) : networkId;

      if (networkId !== NetworkInfo[selectedNetwork].ChainID) {
        return;
      }

      // create the contract instance
      let contract = await getSelectedTokenContractInstance();
      if (!contract) return false;
      setContract(contract);
      setIsMoreMySwapOngoinTableDataLoading(true);
      setMySwapOngoingLoadingText("Loading List");

      // fetch the recent orders my swaps ongoing by non event
      let totalOffers = await getTotalOffers(contract as ethers.Contract);
      setTotalOffers(totalOffers);
      let fromOfferMySwapOngoingId = totalOffers;
      const InitializeFullfillmentDataByNonEvent =
        await listInitializeFullfillmentOnGoingByNonEvent(
          contract,
          account,
          fromOfferMySwapOngoingId
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
    }
  }

  useEffect(() => {
    if (contract) {
      prepareMySwapCompletedData(contract);
      prepareMySwapCompletedDataForAll(contract);
    }
  }, [
    // totalOffers,
    refreshMySwapCompletedListKey,
    account,
    refreshOffersListKey,
    selectedToken,
  ]);

  async function prepareMySwapCompletedData(trustlex: ethers.Contract) {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      let network = await provider.getNetwork();
      let networkId = network.chainId;
      networkId =
        typeof networkId === "string" ? parseInt(networkId) : networkId;

      if (networkId !== NetworkInfo[selectedNetwork].ChainID) {
        return;
      }

      setIsMoreMySwapCompletedTableDataLoading(true);
      setMySwapCompletedLoadingText("Loading List");
      setListenedMySwapCompletedDataByNonEvent([]);

      // create the contract instance
      let contract = await getSelectedTokenContractInstance();
      if (!contract) return false;
      setContract(contract);
      // fetch the recent orders my swaps ongoing by non event
      let totalOffers = await getTotalOffers(contract as ethers.Contract);
      setTotalOffers(totalOffers);

      // fetch the recent orders my swaps ongoing by non event
      let fromOfferMySwapCompetedId = totalOffers;
      const InitializeFullfillmentDataByNonEvent =
        await listInitializeFullfillmentCompletedByNonEvent(
          contract,
          account,
          fromOfferMySwapCompetedId
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
  }

  async function prepareMySwapCompletedDataForAll(trustlex: ethers.Contract) {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      let network = await provider.getNetwork();
      let networkId = network.chainId;
      networkId =
        typeof networkId === "string" ? parseInt(networkId) : networkId;

      if (networkId !== NetworkInfo[selectedNetwork].ChainID) {
        return;
      }
      setIsMoreMySwapAllCompletedTableDataLoading(true);
      setMySwapAllCompletedLoadingText("Loading List");
      setListenedMySwapAllCompletedDataByNonEvent([]);

      // create the contract instance
      let contract = await getSelectedTokenContractInstance();
      if (!contract) return false;
      setContract(contract);
      // fetch the recent orders my swaps ongoing by non event
      let totalOffers = await getTotalOffers(contract as ethers.Contract);
      setTotalOffers(totalOffers);

      // fetch the recent orders my swaps ongoing by non event
      let fromOfferMySwapCompetedId = totalOffers;
      const InitializeFullfillmentDataByNonEvent =
        await listInitializeFullfillmentCompletedByNonEvent(
          contract,
          "",
          fromOfferMySwapCompetedId
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
  }
  async function getSelectedTokenContractInstance() {
    // create the contract instance
    // console.log(
    //   selectedNetwork,
    //   selectedToken,
    //   currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
    // );
    let contractAddress =
      currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
        .orderBookContractAddreess;
    let contractABI =
      currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
        .orderBookContractABI;
    let contract = await createContractInstance(
      contractAddress as string,
      contractABI
    );

    return contract;
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
              <Route path="/" element={<Home />} />
              <Route path="/exchange" element={<Exchange />} />
              <Route path="/recent" element={<Recent />} />
              <Route path="/earn" element={<Earn />} />
            </Routes>
          </Layout>
        </AppContext.Provider>
      </BrowserRouter>
    </MantineProvider>
  );
}
