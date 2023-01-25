import { Center } from "@mantine/core";
import React, { useState } from "react";
import Button from "~/components/Button/Button";
import ExchangeSwapGroup from "~/components/ExchangeSwapGroup/ExchangeSwapGroup";
import GradientBackgroundContainer from "~/components/GradientBackgroundContainer/GradientBackgroundContainer";
import ImageIcon from "~/components/ImageIcon/ImageIcon";
import Input from "~/components/Input/Input";
import { InputWithSelect } from "~/components/InputWithSelect/InputWithSelect";
import Select from "~/components/Select/Select";
import SpanFullGridWidth from "~/components/SpanFullGridWidth/SpanFullGridWidth";
import Table from "~/components/Table/Table";
import {
  data2,
  exchangeTableCols,
  minCollateral,
  offerValidity,
} from "~/data/exchangePage";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import { VariantsEnum } from "~/enums/VariantsEnum";
import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";
import styles from "./Exchange.module.scss";
type Props = {};

const tableDummyData: string[][] = new Array(5).fill([
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
  const [tableData, setTableData] = useState<string[][]>(tableDummyData);
  const [isMoreTableDataLoading, setMoreTableDataLoading] = useState(false);

  const loadMoreOffers = () => {
    setMoreTableDataLoading(true);
    setTimeout(() => {
      setTableData([...tableData, ...tableDummyData]);
      setMoreTableDataLoading(false);
    }, 2000);
  };

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
            <Select label="Offer valid for" data={offerValidity} />
            <div></div>
            <Select
              label={
                <span className={styles.collateralLabel}>
                  <ImageIcon image="/icons/info.svg" /> Minimum Collateral{" "}
                </span>
              }
              data={minCollateral}
            />
            <Button variant={VariantsEnum.primary} radius={10}>
              Confirm
            </Button>
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
              cols={exchangeTableCols}
              data={tableData}
              verticalSpacing={"lg"}
            />
            <br />
            <Center>
              <Button
                variant={VariantsEnum.outline}
                loading={isMoreTableDataLoading}
                onClick={loadMoreOffers}
              >
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
