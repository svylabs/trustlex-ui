import React, { ReactNode } from "react";
import styles from "./Table.module.scss";
import { Table as MantineTable, TableProps } from "@mantine/core";
import useAutoHideScrollbar from "~/utils/useAutoHideScrollBar";

interface Props extends TableProps {
  tableCaption?: string;
  cols: string[];
  data: (string | ReactNode)[][];
}

const Table = ({
  tableCaption,
  data,
  cols,
  verticalSpacing = "md",
  ...props
}: Props) => {
  const tableContainerRef = React.useRef(null);

  useAutoHideScrollbar(tableContainerRef);
  return (
    <div className={styles.root}>
      <h2 className={styles.caption}>{tableCaption}</h2>
      <div className={styles.tableContainer} ref={tableContainerRef}>
        <MantineTable
          verticalSpacing={verticalSpacing}
          highlightOnHover
          {...props}
        >
          <thead>
            <tr>
              {cols.map((col) => {
                return (
                  <th className={styles.cols} key={col}>
                    {col}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {data.map((row, index) => (
              <tr className={styles.tr} key={index}>
                {row.map((item, index) => (
                  <td className={styles.td} key={index}>
                    {item}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </MantineTable>
      </div>
    </div>
  );
};

export default Table;
