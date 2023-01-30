import React, { ReactNode } from "react";
import styles from "./Table.module.scss";
import { Table as MantineTable, TableProps } from "@mantine/core";
import useAutoHideScrollbar from "../../hooks/useAutoHideScrollBar";
import { Icon } from "@iconify/react";

interface Props extends TableProps {
  tableCaption?: string;
  cols: string[];
  data: (string | ReactNode)[][];
  vertical?: boolean;
}

const Table = ({
  tableCaption,
  data,
  cols,
  vertical,
  verticalSpacing = "md",
  ...props
}: Props) => {
  const tableContainerRef = React.useRef(null);

  useAutoHideScrollbar(tableContainerRef);

  const previousData = () => {
    alert("previousData");
  };
  const nextData = () => {
    alert("Next data");
  };

  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <h2 className={styles.caption}>{tableCaption}</h2>

        {vertical && (
          <div className={styles.actions}>
            <Icon
              icon={"material-symbols:chevron-left-rounded"}
              className={styles.icon}
              onClick={previousData}
            />
            <Icon
              icon={"material-symbols:chevron-right-rounded"}
              className={styles.icon}
              onClick={nextData}
            />
          </div>
        )}
      </div>
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
