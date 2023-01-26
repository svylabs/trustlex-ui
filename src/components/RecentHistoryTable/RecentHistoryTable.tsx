import { TableProps } from "@mantine/core";
import React from "react";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import { StatusEnum } from "~/enums/StatusEnum";
import { VariantsEnum } from "~/enums/VariantsEnum";
import { IPlanning } from "~/interfaces/IPlanning";
import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";
import Button from "../Button/Button";
import ImageIcon from "../ImageIcon/ImageIcon";
import Table from "../Table/Table";
import styles from "./RecentHistoryTable.module.scss";

export interface ITableRow {
  orderNumber: string | number;
  planningToSell: IPlanning;
  planningToBuy: IPlanning;
  rateInBTC: number;
  date: string;
  status: StatusEnum;
}

interface Props extends TableProps {
  tableCaption?: string;
  cols: string[];
  data: ITableRow[];
}

const RecentHistoryTable = ({ tableCaption, cols, data }: Props) => {
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
    row.date,
    <div className={styles.statusCell}>
      <ImageIcon image="/icons/check-circle.svg" />
      {row.status}
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

export default RecentHistoryTable;
