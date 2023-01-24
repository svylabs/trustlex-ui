import React from "react";
import Button from "../Button/Button";
import ExchangeGridLayout from "../ExchangeGridLayout/ExchangeGridLayout";
import ImageIcon from "../ImageIcon/ImageIcon";
import { InputWithSelect } from "../InputWithSelect/InputWithSelect";

const data1 = [
  {
    value: "btc",
    label: "BTC",
    icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
  },
];

const data2 = [
  {
    label: "Limit",
    value: "limit",
  },
  {
    label: "No Limit",
    value: "no-limit",
  },
];

const data3 = [
  {
    value: "eth",
    label: "ETH",
    icon: <ImageIcon image={"/icons/ethereum-2.svg"} />,
  },
  {
    value: "solana",
    label: "SOL",
    icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
  },
];

type Props = {};

const ExchangeSwapGroup = (props: Props) => {
  return (
    <ExchangeGridLayout
      left={<InputWithSelect options={data1} label="Buy" value={0.0029} />}
      middle={
        <Button variant="default">
          <ImageIcon image="/icons/swap.svg" />
        </Button>
      }
      right={
        <InputWithSelect
          options={data3}
          type="number"
          value={10.0}
          label={"Pay with (In your wallet: 10 Ethereum)"}
        />
      }
    />
  );
};

export default ExchangeSwapGroup;
