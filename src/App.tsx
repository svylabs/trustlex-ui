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
  listOffers,
  InitializeFullfillment,
  listInitializeFullfillment,
  getOffersList,
  getTotalOffers,
  getERC20TokenBalance,
} from "./service/AppService";
import IUserInputData from "./interfaces/IUserInputData";
import swapArrayElements from "./utils/swapArray";
import { formatERC20Tokens } from "./utils/Ether.utills";
import {
  IListenedOfferData,
  IOffersResult,
  IinitiatedFullfillmentResult,
  IOffersResultByNonEvent,
  OrderBy,
} from "./interfaces/IOfferdata";
import { ethers } from "ethers";
import { ContractMap } from "./Context/AppConfig";
import useLocalstorage from "./hooks/useLocalstorage";
import { PAGE_SIZE, activeExchange } from "~/Context/Constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { number } from "bitcoinjs-lib/src/script";

export default function App() {
  const { get, set, remove } = useLocalstorage();
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [totalOffers, setTotalOffers] = useState(0);
  const [fromOfferId, setFromOfferId] = useState(0);
  const [contract, setContract] = useState<ethers.Contract>();
  const tokenData = get("selectedToken", false);
  const [selectedToken, setSelectedToken] = useState(
    tokenData ? tokenData.toUpperCase() : "ETH"
  );
  const [erc20balance, setERC20balance] = useState("");
  const [erc20TokenContract, setERC20TokenContract] =
    useState<ethers.Contract>();

  const [listenedOfferData, setListenedOfferData] = useState<IOffersResult>({
    fromBlock: 0,
    toBlock: 0,
    offers: [],
  });
  const [isMoreTableDataLoading, setMoreTableDataLoading] = useState(false);
  const [exchangeLoadingText, setExchangeLoadingText] = useState<string>("");
  const [refreshOffersListKey, setRefreshOffersListKey] = useState<number>(1);

  const [listenedOfferDataByNonEvent, setListenedOfferDataByNonEvent] =
    useState<IOffersResultByNonEvent>({
      offers: [],
    });

  const [listenedOngoinMySwapData, setlistenedOngoinMySwapData] =
    useState<IinitiatedFullfillmentResult>({
      fromBlock: 0,
      toBlock: 0,
      offers: [],
    });

  const userData = get("userInputData", true);
  const [userInputData, setUserInputData] = useState<IUserInputData>(
    userData
      ? userData
      : {
          setLimit: true,
          limit: "",
          activeExchange: activeExchange,
        }
  );

  useEffect(() => {
    set("userInputData", userInputData);
    console.log(userInputData);
  }, [userInputData]);

  useEffect(() => {
    set(
      "selectedToken",
      // if you have multiple token address in AppConfig.tsx,
      // you can use this line instead of ETH
      // this line throws error if all the activeExchange are not in AppConfig.tsx

      // userInputData.activeExchange[1].currency.toUpperCase()
      "ETH"
    );
  }, [userInputData.activeExchange]);

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);

      (ethereum as any).on("accountsChanged", async function (accounts: any) {
        let trustlex = await connect(
          provider,
          ContractMap[selectedToken].address
        );
        if (trustlex) {
          setContract(trustlex as ethers.Contract);
        }

        setAccount(accounts[0]);
        let balance = await getBalance(accounts[0]);
        if (balance) {
          setBalance(balance);
        }

        let tokenBalance_ = await getERC20TokenBalance(accounts[0]);
        let tokenBalance = formatERC20Tokens(tokenBalance_);
        setERC20balance(tokenBalance);
      });
    }
  }, []);

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

  useEffect(() => {
    (async () => {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);

        setMoreTableDataLoading(true);
        setListenedOfferDataByNonEvent({ offers: [] });
        setExchangeLoadingText("Connecting to Network");

        let trustlex = await connect(
          provider,
          ContractMap[selectedToken].address
        );
        if (trustlex) {
          setContract(trustlex as ethers.Contract);
          const offers = await listOffers(trustlex);
          setListenedOfferData(offers);

          setMoreTableDataLoading(true);
          setExchangeLoadingText("Loading List");
          let totalOffers = await getTotalOffers(trustlex);
          setTotalOffers(totalOffers);

          let fromOfferId = totalOffers;

          let offersList = await getOffersList(trustlex, fromOfferId);
          fromOfferId =
            fromOfferId - PAGE_SIZE > 0 ? fromOfferId - PAGE_SIZE : 0;
          setFromOfferId(fromOfferId);
          // console.log(totalOffers, totalOffers, fromOfferId, offersList);
          setListenedOfferDataByNonEvent(offersList);
          setMoreTableDataLoading(false);
          setExchangeLoadingText("");

          const InitializeFullfillmentData = await listInitializeFullfillment(
            trustlex
          );
          // console.log(InitializeFullfillmentData);
          setlistenedOngoinMySwapData(InitializeFullfillmentData);
        }

        let account = await findMetaMaskAccount();
        if (account !== null) {
          setAccount(account);
          getBalance(account).then((balance) => {
            if (balance) {
              setBalance(balance);
            }
          });
        }

        let tokenBalance_ = await getERC20TokenBalance(account);
        let tokenBalance = formatERC20Tokens(tokenBalance_);
        setERC20balance(tokenBalance);
      }
      return () => {
        setAccount("");
        setBalance("");
      };
    })();
  }, [refreshOffersListKey]);

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
          }}
        >
          <Layout>
            <ToastContainer />

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
