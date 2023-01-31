import React from "react";
import { VariantsEnum } from "~/enums/VariantsEnum";
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

type Props = {
  activeExchange?: string;
  setActiveExchange?: React.Dispatch<React.SetStateAction<string>>;
};

const ExchangeSwapGroup = (props: Props) => {
  return (
    <>
      {props.activeExchange === "btc" && (
        <ExchangeGridLayout
          left={<InputWithSelect options={data1} label="Buy" value={0.0029} />}
          middle={
            <Button
              variant={VariantsEnum.default}
              onClick={() => {
                if (
                  props.setActiveExchange !== undefined &&
                  props.activeExchange !== undefined
                )
                  props.setActiveExchange("eth");
              }}
            >
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
      )}

      {props.activeExchange !== undefined && props.activeExchange === "eth" && (
        <ExchangeGridLayout
          left={
            <InputWithSelect
              options={data3}
              type="number"
              value={10.0}
              label={"Buy"}
            />
          }
          middle={
            <Button
              variant={VariantsEnum.default}
              onClick={() => {
                if (
                  props.setActiveExchange !== undefined &&
                  props.activeExchange !== undefined
                )
                  props.setActiveExchange("btc");
              }}
            >
              <ImageIcon image="/icons/swap.svg" />
            </Button>
          }
          right={
            <InputWithSelect
              options={data1}
              label="Pay with (In your wallet: 10 Bitcoin)"
              value={0.0029}
            />
          }
        />
      )}
    </>
  );
};

export default ExchangeSwapGroup;
