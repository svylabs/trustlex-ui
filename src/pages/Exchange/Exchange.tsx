import React from "react";
import Button from "~/components/Button/Button";
import ExchangeGridLayout from "~/components/ExchangeGridLayout/ExchangeGridLayout";
import ExchangeSwapGroup from "~/components/ExchangeSwapGroup/ExchangeSwapGroup";
import GradientBackgroundContainer from "~/components/GradientBackgroundContainer/GradientBackgroundContainer";
import ImageIcon from "~/components/ImageIcon/ImageIcon";
import Input from "~/components/Input/Input";
import { InputWithSelect } from "~/components/InputWithSelect/InputWithSelect";
import Select from "~/components/Select/Select";
import SpanFullGridWidth from "~/components/SpanFullGridWidth/SpanFullGridWidth";
import styles from "./Exchange.module.scss";
type Props = {};

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

const Exchange = (props: Props) => {
  return (
    <div className={styles.root}>
      <h1 className={styles.pageTitle}>Exchange</h1>
      <p className={styles.pageDesc}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>

      <div className={styles.exchangeForm}>
        <GradientBackgroundContainer
          colorRight="#FEBD3863"
          colorLeft="#FEBD3833"
          bgImage="/images/Rectangle-large.png"
        >
          <div className={styles.exchangeFormContent}>
            <SpanFullGridWidth>
              <ExchangeSwapGroup />
            </SpanFullGridWidth>
            <InputWithSelect
              options={data2}
              type="number"
              placeholder={"Limit price BTC/ETC"}
            />
            <SpanFullGridWidth>
              <Input
                type={"text"}
                label="Address to receive Bitcoin"
                placeholder="Type here"
              />
            </SpanFullGridWidth>
            <Select
              label="Offer valid for"
              data={[
                {
                  label: "5 hours",
                  value: "5hrs",
                },
                {
                  label: "10 hours",
                  value: "10hrs",
                },
                {
                  label: "1 day",
                  value: "1d",
                },
              ]}
            />
            <div></div>
            <Select
              label={
                <span className={styles.collateralLabel}>
                  <ImageIcon image="/icons/info.svg" /> Minimum Collateral{" "}
                </span>
              }
              data={[
                {
                  label: "0%",
                  value: "0",
                },
                {
                  label: "5%",
                  value: "5",
                },
                {
                  label: "10%",
                  value: "10",
                },
                {
                  label: "15%",
                  value: "15",
                },
                {
                  label: "20%",
                  value: "20",
                },
              ]}
            />
            <Button variant="primary">Confirm</Button>
          </div>
        </GradientBackgroundContainer>
      </div>
    </div>
  );
};

export default Exchange;
