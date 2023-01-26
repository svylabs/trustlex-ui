import { TableProps } from "@mantine/core";
import React, { useState } from "react";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import { VariantsEnum } from "~/enums/VariantsEnum";
import { IPlanning } from "~/interfaces/IPlanning";
import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";
import ActionButton from "../ActionButton/ActionButton";
import Button from "../Button/Button";
import ImageIcon from "../ImageIcon/ImageIcon";
import Table from "../Table/Table";
import ViewOrderDrawer from "../ViewOrderDrawer/ViewOrderDrawer";
import styles from "./RecentOngoingTable.module.scss";

export interface ITableRow {
  orderNumber: string | number;
  planningToSell: IPlanning;
  planningToBuy: IPlanning;
  rateInBTC: number;
  progress: string;
}

interface Props extends TableProps {
  tableCaption?: string;
  cols: string[];
  data: ITableRow[];
}

const RecentOngoingTable = ({ tableCaption, cols, data }: Props) => {
  const [isViewOrderDrawerOpen, setViewOrderDrawerOpen] = useState(false);

  const tableData = data.map((row) => [
    row.orderNumber,
    <div className={styles.planningCell}>
      {row.planningToSell.amount}{" "}
      <ImageIcon image={getIconFromCurrencyType(row.planningToSell.type)} />{" "}
      {row.planningToSell.type}
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
    row.progress,
    <div className={styles.actionsCell}>
      <ActionButton size="compact" variant={"default"} onClick={() => {}}>
        Cancel
      </ActionButton>
      <ActionButton
        size="compact"
        variant={"primary"}
        onClick={() => setViewOrderDrawerOpen(true)}
      >
        View
      </ActionButton>
    </div>,
  ]);

  return (
    <>
      <ViewOrderDrawer
        isOpened={isViewOrderDrawerOpen}
        onClose={() => setViewOrderDrawerOpen(false)}
      />
      <Table
        verticalSpacing={"lg"}
        tableCaption={tableCaption}
        cols={cols}
        data={tableData}
      />
    </>
  );
};

export default RecentOngoingTable;
