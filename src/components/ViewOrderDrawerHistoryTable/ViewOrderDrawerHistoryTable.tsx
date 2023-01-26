import { Center, TableProps } from "@mantine/core";
import React from "react";
import { VariantsEnum } from "~/enums/VariantsEnum";
import { IPlanning } from "~/interfaces/IPlanning";
import Button from "../Button/Button";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import Table from "../Table/Table";

export interface ITableRow {
  orderNumber: string | number;
  planningToSell: IPlanning;
  planningToBuy: IPlanning;
  date: string;
}

interface Props extends TableProps {
  tableCaption?: string;
  cols: string[];
  data: ITableRow[];
}

const ViewOrderDrawerHistoryTable = ({ tableCaption, cols, data }: Props) => {
  const tableData = data.map((item) => [
    item.orderNumber,
    <CurrencyDisplay {...item.planningToSell} />,
    <CurrencyDisplay {...item.planningToBuy} />,
    item.date,
  ]);
  return (
    <div>
      <Table
        verticalSpacing={"lg"}
        tableCaption={tableCaption}
        cols={cols}
        data={tableData}
      />
      <br />
      <Center>
        <Button variant={VariantsEnum.outline}>Load more</Button>
      </Center>
    </div>
  );
};

export default ViewOrderDrawerHistoryTable;
