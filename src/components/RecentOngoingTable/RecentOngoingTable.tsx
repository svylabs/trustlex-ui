import { TableProps } from "@mantine/core";
import React from "react";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import { VariantsEnum } from "~/enums/VariantsEnum";
import { IPlanning } from "~/interfaces/IPlanning";
import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";
import Button from "../Button/Button";
import ImageIcon from "../ImageIcon/ImageIcon";
import Table from "../Table/Table";
import styles from "./RecentOngoingTable.module.scss";

export interface ITableRow {
  orderNumber: string | number;
  planningToSell: IPlanning;
  planningToBuy: IPlanning;
  rateInBTC: number;
  progress: string;
  actions: {
    cancel: Function;
    view: Function;
  };
}

interface Props extends TableProps {
  tableCaption?: string;
  cols: string[];
  data: ITableRow[];
}

const RecentOngoingTable = ({ tableCaption, cols, data }: Props) => {
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
      <Button
        variant={VariantsEnum.default}
        compact
        size="sm"
        onClick={() => row.actions.cancel()}
      >
        Cancel
      </Button>
      <Button
        compact
        size="sm"
        variant={VariantsEnum.outlinePrimary}
        onClick={() => row.actions.view()}
      >
        View
      </Button>
    </div>,
  ]);

  return (
    <Table
      verticalSpacing={"lg"}
      tableCaption={tableCaption}
      cols={cols}
      data={tableData}
    />
  );
};

export default RecentOngoingTable;
