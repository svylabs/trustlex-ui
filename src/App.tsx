import { MantineProvider } from "@mantine/core";
import Layout from "./components/Layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Earn from "~/pages/Earn/Earn";
import Home from "~/pages/Home/Home";
import Exchange from "~/pages/Exchange/Exchange";
import Recent from "./pages/Recent/Recent";
import { AppContext } from "./Context/AppContext";
import { useState, useEffect } from "react";
import { findMetaMaskAccount, getOffers } from "./service/AppService";
import IUserInputData from "./interfaces/IUserInputData";
import swapArrayElements from "./utils/swapArray";

export default function App() {
  const [account, setAccount] = useState("");
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
    findMetaMaskAccount().then((account) => {
      if (account !== null) {
        setAccount(account);
      }
    });
  }, []);
  // useEffect(() => {
  //   if (account !== null) {
  //     getOffers();
  //   }
  // }, []);

  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <BrowserRouter>
        <AppContext.Provider
          value={{
            account,
            setAccount,
            userInputData,
            setUserInputData,
            swapChange,
            dropDownChange,
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
