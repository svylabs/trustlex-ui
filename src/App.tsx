import { MantineProvider } from "@mantine/core";
import Layout from "./components/Layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Earn from "~/pages/Earn/Earn";
import Home from "~/pages/Home/Home";
import Exchange from "~/pages/Exchange/Exchange";
import Recent from "./pages/Recent/Recent";
import { AppContext } from "./Context/AppContext";
import { useState, useEffect, useContext } from "react";
import { connect, findMetaMaskAccount, getBalance } from "./service/AppService";
import IUserInputData from "./interfaces/IUserInputData";
import swapArrayElements from "./utils/swapArray";
import { IListenedOfferData } from "./interfaces/IOfferdata";
import { ethers } from "ethers";

export default function App() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [contract, setContract] = useState<ethers.Contract>();
  const [listenedOfferData, setListenedOfferData] = useState<
    IListenedOfferData[] | []
  >([]);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  window.ethereum.on('accountsChanged', function (accounts) {
      //onsole.log("Account changed..", accounts);
      setAccount(accounts[0]);
      getBalance(accounts[0]).then((balance) => {
        if (balance) {
          setBalance(balance);
        }
      });
  });

  const [userInputData, setUserInputData] = useState<IUserInputData>({
    setLimit: true,
    limit: "0",
    activeExchange: [
      { currency: "btc", value: "0" },
      { currency: "eth", value: "0" },
      { currency: "sol", value: "0" },
      { currency: "doge", value: "0" },
    ],
  });
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
      fromItem.value = "0";
      let toItem = prev.activeExchange[toIndex];
      toItem.value = "0";

      let activeExchangeData = prev.activeExchange;
      activeExchangeData[fromIndex] = toItem;
      activeExchangeData[toIndex] = fromItem;

      return { ...prev, activeExchange: activeExchangeData };
    });
  };

  useEffect(() => {
    connect(provider).then((trustlex) => {
      if (trustlex) {
        setContract(trustlex as ethers.Contract);
      }
      findMetaMaskAccount().then((account) => {
        if (account !== null) {
          setAccount(account);
          console.log("Account: ", account);
          getBalance(account).then((balance) => {
            if (balance) {
              setBalance(balance);
            }
          });
        }
      });
    });
    return () => {
      setAccount("");
      setBalance("");
    };
  }, []);

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
            contract,
            setContract,
            userInputData,
            setUserInputData,
            swapChange,
            dropDownChange,
            listenedOfferData,
            setListenedOfferData,
          }}
        >
          <Layout>
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
