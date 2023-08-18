import { TableProps } from "@mantine/core";
import {
  ITableRow,
  GetProgressText,
} from "../RecentHistoryTable/RecentHistoryTable";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
import Table from "../Table/Table";
import styles from "./AllSwapTable.module.scss";
import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";
import ImageIcon from "../ImageIcon/ImageIcon";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import SeeMoreButton from "../SeeMoreButton/SeeMoreButton";
import ViewOrderDrawer from "../ViewOrderDrawer/ViewOrderDrawer";
import { ethers } from "ethers";
import { IListInitiatedFullfillmentDataByNonEvent } from "~/interfaces/IOfferdata";
import { useState, useEffect } from "react";
import { currencyObjects } from "~/Context/Constants";

interface Props extends TableProps {
  tableCaption?: string;
  cols: string[];
  data: ITableRow[];
  contract: ethers.Contract | undefined;
  selectedToken: string;
  selectedNetwork: string;
}

const AllSwapTable = ({
  tableCaption,
  cols,
  data,
  contract,
  selectedToken,
  selectedNetwork,
}: Props) => {
  const { mobileView } = useWindowDimensions();
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
  const tableData =
    !mobileView && data.length > 0
      ? data.map((row) => [
          row.orderNumber,
          <div className={styles.planningCell}>
            {row.planningToSell.amount}{" "}
            <ImageIcon
              image={getIconFromCurrencyType(row.planningToSell.type)}
            />{" "}
            {row.planningToSell.type}
          </div>,
          <div className={styles.planningCell}>
            {row.planningToBuy.amount}{" "}
            <ImageIcon
              image={getIconFromCurrencyType(row.planningToBuy.type)}
            />{" "}
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
        horizontalSpacing={mobileView ? "xs" : "md"}
        verticalSpacing={"md"}
        tableCaption={tableCaption}
        cols={cols}
        data={tableData}
      />
    </>
  );
};

export default AllSwapTable;
