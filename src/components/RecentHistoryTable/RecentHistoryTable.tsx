import { useState, useEffect } from "react";
import { TableProps } from "@mantine/core";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import { StatusEnum } from "~/enums/StatusEnum";
import { IPlanning } from "~/interfaces/IPlanning";
import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";
import ImageIcon from "../ImageIcon/ImageIcon";
import Table from "../Table/Table";
import styles from "./RecentHistoryTable.module.scss";
import SeeMoreButton from "../SeeMoreButton/SeeMoreButton";
import { currencyObjects } from "~/Context/Constants";
import { IListInitiatedFullfillmentDataByNonEvent } from "~/interfaces/IOfferdata";
import ViewOrderDrawer from "../ViewOrderDrawer/ViewOrderDrawer";
import { ethers } from "ethers";

export interface ITableRow {
  orderNumber: string | number;
  planningToSell: IPlanning;
  planningToBuy: IPlanning;
  rateInBTC: number;
  date: string;
  status: StatusEnum;
  offerData: IListInitiatedFullfillmentDataByNonEvent;
}

interface Props extends TableProps {
  tableCaption?: string;
  cols: string[];
  data: ITableRow[];
  mobile?: boolean;
  contract: ethers.Contract | undefined;
  selectedToken: string;
  selectedNetwork: string;
}

const RecentHistoryTable = ({
  tableCaption,
  cols,
  data,
  mobile,
  contract,
  selectedToken,
  selectedNetwork,
}: Props) => {
  const [isViewOrderDrawerOpen, setViewOrderDrawerOpen] = useState(false);
  const [offerData, setOfferData] =
    useState<IListInitiatedFullfillmentDataByNonEvent>();
  const [viewOrderDrawerKey, setViewOrderDrawerKey] = useState(0);

  const [selectedCurrencyIcon, setSelectedCurrencyIcon] = useState<
    JSX.Element | string
  >(currencyObjects[selectedNetwork][selectedToken?.toLowerCase()]?.icon);
  useEffect(() => {
    setSelectedCurrencyIcon(
      currencyObjects[selectedNetwork][selectedToken?.toLowerCase()]?.icon
    );
  }, [selectedToken]);

  const tableData = !mobile
    ? data.map((row) => [
        row.orderNumber,
        <div className={styles.planningCell}>
          {row.planningToSell.amount}{" "}
          {/* <ImageIcon image={getIconFromCurrencyType(row.planningToSell.type)} />{" "}
          {row.planningToSell.type} */}
          {selectedCurrencyIcon}
          {selectedToken}
        </div>,
        <div className={styles.planningCell}>
          {row.planningToBuy.amount}{" "}
          <ImageIcon image={getIconFromCurrencyType(row.planningToBuy.type)} />{" "}
          {row.planningToBuy.type}
        </div>,
        <div className={styles.planningCell}>
          {row.rateInBTC}{" "}
          <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.BTC)} />{" "}
          {CurrencyEnum.BTC}
        </div>,
        row.date,
        <div className={styles.statusCell}>
          <ImageIcon image="/icons/check-circle.svg" />
          {row.status}
        </div>,
      ])
    : data.map((row) => [
        row.orderNumber,

        row.date,
        <SeeMoreButton
          onClick={(e) => {
            // setViewOrderDrawerOpen(true);
            handleViewClick(row.offerData);
          }}
        />,
      ]);

  const handleViewClick = (
    offerData: IListInitiatedFullfillmentDataByNonEvent
  ) => {
    setViewOrderDrawerKey(viewOrderDrawerKey + 1);
    setOfferData(offerData);
    setViewOrderDrawerOpen(true);
  };

  useEffect(() => {
    setViewOrderDrawerKey(viewOrderDrawerKey + 1);
  }, []);

  return (
    <>
      <ViewOrderDrawer
        isOpened={isViewOrderDrawerOpen}
        onClose={() => setViewOrderDrawerOpen(false)}
        offerData={offerData}
        contract={contract}
        key={viewOrderDrawerKey}
        GetProgressText={GetProgressText}
        selectedCurrencyIcon={selectedCurrencyIcon}
        isCompleted={true}
      />
      <Table
        horizontalSpacing={mobile ? "xs" : "md"}
        verticalSpacing={"md"}
        tableCaption={tableCaption}
        cols={cols}
        data={tableData}
      />
    </>
  );
};

export default RecentHistoryTable;

// function is used to make text wrap.
export const GetProgressText = ({ progress }: { progress: string }) => {
  if (!(typeof progress == "string" && progress.includes(" "))) return progress;
  const progressArr = progress.split(" ");
  let progressArrLen = progressArr.length;
  const progresText = [];
  for (let i = 0; i < progressArrLen; i = i + 2) {
    progresText.push(
      progressArr[i] +
        " " +
        (typeof progressArr[i + 1] !== "undefined"
          ? progressArr[i + 1] + " "
          : "")
    );
  }

  return (
    <>
      {progresText.map((value, index) => {
        return (
          <div key={index}>
            {value}
            <br />
          </div>
        );
      })}
    </>
  );
};
