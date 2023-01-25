import { Center } from "@mantine/core";
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
import Table from "~/components/Table/Table";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import { IExchangeTableRow } from "~/interfaces/IExchangeTableRow";
import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";
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

// const tableData: IExchangeTableRow[] = [
//   {
//     orderNumber: 1211,
//     planningToSell: {
//       amount: 10,
//       type: CurrencyEnum.ETH,
//     },
//     planningToBuy: {
//       amount: 0.078,
//       type: CurrencyEnum.BTC,
//     },
//     rateInBTC: 0.078,
//     leftToBuy: {
//       left: 1,
//       total: 10,
//       type: CurrencyEnum.ETH,
//     },
//     validFor: "1h",
//     date: new Date(),
//   },
// ];

const tableData = new Array(5).fill([
  1211,
  <>
    10 <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.ETH)} />{" "}
    {CurrencyEnum.ETH}
  </>,
  <>
    0.078 <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.BTC)} />{" "}
    {CurrencyEnum.BTC}
  </>,
  <>
    0.078 <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.BTC)} />{" "}
    {CurrencyEnum.BTC}
  </>,
  <>
    1 out of 10 <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.ETH)} />{" "}
    {CurrencyEnum.ETH}
  </>,
  "1h",
  "09 Jan, 13:45pm",
]);

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

      <div className={styles.offersTable}>
        <GradientBackgroundContainer
          colorRight="#FEBD3863"
          colorLeft="#FEBD3833"
          bgImage="/images/Rectangle-large.png"
        >
          <div className={styles.innerWrapper}>
            <Table
              tableCaption="All offers"
              data={tableData}
              verticalSpacing={"lg"}
            />
            <br />
            <Center>
              <Button variant="outlined" loading>
                Load more
              </Button>
            </Center>
          </div>
        </GradientBackgroundContainer>
      </div>
    </div>
  );
};

export default Exchange;
