import React from "react";
import { VariantsEnum } from "~/enums/VariantsEnum";
import Button from "../Button/Button";
import ExchangeGridLayout from "../ExchangeGridLayout/ExchangeGridLayout";
import ImageIcon from "../ImageIcon/ImageIcon";
import { InputWithSelect } from "../InputWithSelect/InputWithSelect";
import { AppContext } from "~/Context/AppContext";
const currencyObjects: {
  [key: string]: {
    label: string;
    value: string;
    icon: JSX.Element;
  };
} = {
  eth: {
    label: "ETH",
    value: "ethereum",
    icon: <ImageIcon image={"/icons/ethereum-2.svg"} />,
  },
  btc: {
    label: "BTC",
    value: "bitcoin",
    icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
  },
  sol: {
    label: "SOL",
    value: "solana",
    icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
  },
  doge: {
    label: "DOGE",
    value: "doge",
    icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
  },
};

type Props = {};

const ExchangeSwapGroup = (props: Props) => {
  const context = React.useContext(AppContext);
  if (context === null) {
    return <>Loading...</>;
  }

  const { balance, userInputData, setUserInputData, swapChange } = context;

  const filteredForLeft = userInputData.activeExchange
    .filter((item, index) => {
      if (index !== 1 && item.currency !== "btc") {
        return item;
      }
    })
    .map((item) => currencyObjects[item.currency]);

  const leftItems =
    userInputData.activeExchange[0].currency !== "btc"
      ? filteredForLeft
      : [currencyObjects[userInputData.activeExchange[0].currency]];

  const filteredForRight = userInputData.activeExchange
    .filter((item, index) => {
      if (index !== 0 && item.currency !== "btc") {
        return item;
      }
    })
    .map((item) => currencyObjects[item.currency]);
  const rightItems =
    userInputData.activeExchange[1].currency !== "btc"
      ? filteredForRight
      : [currencyObjects[userInputData.activeExchange[1].currency]];

  const handleLeftDataChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // if (e.target.value !== "") {
    //   const exchange = new ccxt.binance();
    //   const symbol = "ETH/BTC";
    //   const ticker = await exchange.fetchTicker(symbol);
    //   const rate = ticker.last;
    //   if (rate === undefined) return;
    //   console.log(+e.target.value * rate);
    // } else {
    //   console.log("Empty");
    // }

    setUserInputData((prev) => {
      let activeExchange = prev.activeExchange;
      activeExchange[0].value = e.target.value;

      return { ...prev, activeExchange: activeExchange };
    });
  };

  const handleRightDataChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUserInputData((prev) => {
      let activeExchange = prev.activeExchange;

      activeExchange[1].value = e.target.value;
      return { ...prev, activeExchange: activeExchange };
    });
  };

  return (
    <>
      <ExchangeGridLayout
        left={
          <InputWithSelect
            type="number"
            options={leftItems}
            label={"Buy"}
            value={userInputData.activeExchange[0].value}
            onChange={handleLeftDataChange}
            placeholder="Enter buy amount"
          />
        }
        middle={
          <Button
            variant={VariantsEnum.default}
            onClick={() => {
              swapChange();
            }}
          >
            <ImageIcon image="/icons/swap.svg" />
          </Button>
        }
        right={
          <InputWithSelect
            options={rightItems}
            type="number"
            value={userInputData.activeExchange[1].value}
            onChange={handleRightDataChange}
            placeholder="Enter pay amount"
            label={`Pay with (In your wallet: ${
              userInputData.activeExchange[1].currency === "eth" ? Number(balance).toFixed(0) : 10
            } ${
              currencyObjects[userInputData.activeExchange[1].currency].value
            })`}
          />
        }
      />
    </>
  );
};

export default ExchangeSwapGroup;
