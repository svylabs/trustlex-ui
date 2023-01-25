import React, { ReactNode } from "react";
import styles from "./Table.module.scss";
import { Table as MantineTable, TableProps } from "@mantine/core";

interface Props extends TableProps {
  tableCaption?: string;
  data: (string | ReactNode)[][];
}

const cols = [
  "# of order",
  "Planning to sell",
  "Planning to buy",
  "Price per ETH in BTC",
  "Left to buy",
  "Offer valid for",
  "Date",
];

// {row.planningToSell.amount}{" "}
//                 <ImageIcon
//                   image={getIconFromCurrencyType(row.planningToSell.type)}
//                 />{" "}
//                 {row.planningToSell.type}
const Table = ({
  tableCaption,
  data,
  verticalSpacing = "md",
  ...props
}: Props) => {
  return (
    <div className={styles.root}>
      <h2 className={styles.caption}>{tableCaption}</h2>
      <MantineTable
        verticalSpacing={verticalSpacing}
        highlightOnHover
        {...props}
      >
        <thead>
          <tr>
            {cols.map((col) => (
              <th className={styles.cols} key={col}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {data.map((row, index) => (
            <tr className={styles.tr} key={index}>
              {row.map((item) => (
                <td className={styles.td}>{item}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </MantineTable>
    </div>
  );
};

export default Table;
