import { Center, TableProps } from "@mantine/core";
import { useState } from "react";
import { IPlanning } from "~/interfaces/IPlanning";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import Table from "../Table/Table";
import ActionButton from "../ActionButton/ActionButton";
import styles from "./ViewOrderDrawerHistoryTable.module.scss";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
import MobileHistoryTable from "../MoblieComponents/MobileHistoryTable/MobileHistoryTable";
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
  const [isMoreTableDataLoading, setIsMoreTableDataLoading] = useState(false);
  const { width } = useWindowDimensions();
  let mobileView: boolean = width !== null && width < 500 ? true : false;

  const loadMoreData = () => {
    setIsMoreTableDataLoading(true);
    setTimeout(() => {
      setIsMoreTableDataLoading(false);
    }, 2000);
  };
  const tableData = data.map((item) => [
    item.orderNumber,
    <CurrencyDisplay {...item.planningToSell} />,
    <CurrencyDisplay {...item.planningToBuy} />,
    item.date,
  ]);
  return (
    <div className={styles.root}>
      {!mobileView ? (
        <Table
          verticalSpacing={"lg"}
          tableCaption={tableCaption}
          cols={cols}
          data={tableData}
        />
      ) : (
        <MobileHistoryTable
          verticalSpacing={"lg"}
          tableCaption={tableCaption}
          cols={cols}
          data={tableData}
        />
      )}

      <br />
      {!mobileView && (
        <Center>
          <ActionButton
            variant={"transparent"}
            loading={isMoreTableDataLoading}
            onClick={loadMoreData}
          >
            Load more
          </ActionButton>
        </Center>
      )}
    </div>
  );
};

export default ViewOrderDrawerHistoryTable;
