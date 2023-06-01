import { Divider, TableProps } from "@mantine/core";
import { useState, useEffect } from "react";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import { IPlanning } from "~/interfaces/IPlanning";
import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";
import ActionButton from "../ActionButton/ActionButton";
import ImageIcon from "../ImageIcon/ImageIcon";
import Table from "../Table/Table";
import ViewOrderDrawer from "../ViewOrderDrawer/ViewOrderDrawer";
import styles from "./RecentOngoingTable.module.scss";
import SeeMoreButton from "../SeeMoreButton/SeeMoreButton";
import { IListInitiatedFullfillmentDataByNonEvent } from "~/interfaces/IOfferdata";
import { ethers } from "ethers";

export interface ITableRow {
  orderNumber: string | number;
  planningToSell: IPlanning;
  planningToBuy: IPlanning;
  rateInBTC: number;
  progress: string;
  offerType: string;
  fullfillmentRequestId: string | undefined;
  offerId: number | string;
  fullfillmentExpiryTime: string | undefined;
  quantityRequested: string | undefined;
  offerData: IListInitiatedFullfillmentDataByNonEvent;
  paymentProofSubmitted: boolean | undefined;
}

interface Props extends TableProps {
  tableCaption?: string;
  cols: string[];
  data: ITableRow[];
  mobile?: boolean;
  handleSubmitPaymentProof: (
    fullfillmentRequestId: string | undefined,
    offerId: number,
    fullfillmentExpiryTime: string | undefined,
    quantityRequested: string | undefined,
    paymentProofSubmitted: boolean | undefined
  ) => void;
  mySwapOngoingLoadingText: string;
  contract: ethers.Contract | undefined;
}
export const GetProgressText = ({ progress }: { progress: string }) => {
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
      {progresText.map((value) => {
        return (
          <>
            {value}
            <br />
          </>
        );
      })}
    </>
  );
};

const RecentOngoingTable = ({
  tableCaption,
  cols,
  data,
  mobile,
  handleSubmitPaymentProof,
  mySwapOngoingLoadingText,
  contract,
}: Props) => {
  const [isViewOrderDrawerOpen, setViewOrderDrawerOpen] = useState(false);
  const [offerData, setOfferData] =
    useState<IListInitiatedFullfillmentDataByNonEvent>();
  const [viewOrderDrawerKey, setViewOrderDrawerKey] = useState(0);

  const tableData = !mobile
    ? data.map((row) => {
        let progress = row.progress;
        return [
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
          <>
            <GetProgressText progress={progress} />
          </>,
          <div className={styles.actionsCell}>
            {row.offerType == "my_order" ? (
              <>
                <ActionButton
                  size="compact"
                  variant={"default"}
                  onClick={() => {
                    handleSubmitPaymentProof(
                      row.fullfillmentRequestId,
                      row.offerId as number,
                      row.fullfillmentExpiryTime,
                      row.quantityRequested,
                      row.paymentProofSubmitted
                    );
                  }}
                >
                  Submit <br /> Payment Proof
                </ActionButton>
              </>
            ) : (
              <>
                <ActionButton
                  size="compact"
                  variant={"default"}
                  onClick={() => {}}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  size="compact"
                  variant={"primary"}
                  onClick={() => {
                    console.log("ok");
                    handleViewClick(row.offerData);
                    // console.log(row.offerData);
                  }}
                >
                  View
                </ActionButton>
              </>
            )}
          </div>,
        ];
      })
    : data.map((row) => {
        const progress = row.progress.split("and");
        return [
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
          <>
            {row.progress
              .substring(0, row.progress.indexOf(" "))
              .toLowerCase() === "submit"
              ? "Done"
              : row.progress.substring(0, row.progress.indexOf(" "))}
          </>,
          <div className={styles.actionsCell}>
            <SeeMoreButton
              buttonText=""
              onClick={(e) => {
                // setViewOrderDrawerOpen(true);
                handleViewClick(row.offerData);
                console.log("ok2");
              }}
            />
          </div>,
        ];
      });

  const handleViewClick = (
    offerData: IListInitiatedFullfillmentDataByNonEvent
  ) => {
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
      />

      <Table
        showAddOfferButton={false}
        horizontalSpacing={mobile ? "xs" : "md"}
        verticalSpacing={"md"}
        tableCaption={tableCaption}
        cols={cols}
        data={tableData}
        loadingText={mySwapOngoingLoadingText}
      />
    </>
  );
};

export default RecentOngoingTable;
