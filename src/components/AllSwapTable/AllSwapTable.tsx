import { TableProps } from "@mantine/core";
import { ITableRow } from "../RecentHistoryTable/RecentHistoryTable";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
import Table from "../Table/Table";
import styles from "./AllSwapTable.module.scss";
import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";
import ImageIcon from "../ImageIcon/ImageIcon";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import SeeMoreButton from "../SeeMoreButton/SeeMoreButton";

interface Props extends TableProps {
  tableCaption?: string;
  cols: string[];
  data: ITableRow[];
}

const AllSwapTable = ({ tableCaption, cols, data }: Props) => {
  const { mobileView } = useWindowDimensions();

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
          <SeeMoreButton onClick={() => {}} />,
        ]);

  return (
    <Table
      horizontalSpacing={mobileView ? "xs" : "lg"}
      verticalSpacing={"lg"}
      tableCaption={tableCaption}
      cols={cols}
      data={tableData}
    />
  );
};

export default AllSwapTable;
