import styles from "./EarnMobileTable.module.scss";

import React, { ReactNode } from "react";
import { Table as MantineTable, TableProps } from "@mantine/core";
import useAutoHideScrollbar from "../../hooks/useAutoHideScrollBar";
import Button from "../Button/Button";
import { VariantsEnum } from "~/enums/VariantsEnum";

interface Props extends TableProps {
  tableCaption?: string;
  cols: string[];
  data: (string | ReactNode)[][];
  onRowClick?: (data: (string | ReactNode)[]) => void;
}

const EarnMobileTable = ({
  tableCaption,
  data,
  cols,
  verticalSpacing = "md",
  onRowClick,
  ...props
}: Props) => {
  return (
    <div className={styles.root}>
      {tableCaption !== "" && (
        <div className={styles.heading}>
          <h2 className={styles.caption}>{tableCaption}</h2>
        </div>
      )}

      <div className={styles.tableContainer}>
        {data.map((row, index) => (
          <TableItem
            cols={cols}
            row={row}
            key={index}
            onRowClick={onRowClick}
          />
        ))}
      </div>
    </div>
  );
};

interface ITableITem {
  cols: string[];
  row: (string | ReactNode)[];
  onRowClick?: (data: (string | ReactNode)[]) => void;
}

const TableItem = ({ cols, row, onRowClick }: ITableITem) => {
  const tableItemRootRef = React.useRef(null);

  useAutoHideScrollbar(tableItemRootRef);
  return (
    <div className={styles.tableItemRoot} ref={tableItemRootRef}>
      <MantineTable
        verticalSpacing={"xs"}
        horizontalSpacing={"xs"}
        highlightOnHover
        // {...props}
      >
        <thead className={styles.thead}>
          <tr>
            {cols
              .filter((col) => col !== "")
              .map((col) => {
                return (
                  <th className={styles.cols} key={col}>
                    {col}
                  </th>
                );
              })}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          <tr
            className={`${styles.tr} ${
              onRowClick !== undefined && styles.pointer
            }`}
          >
            {row
              .filter((item, index) => {
                if (index < 3) {
                  return item;
                }
              })
              .map((item, index) => (
                <td className={styles.td} key={index}>
                  {item}
                </td>
              ))}
          </tr>
        </tbody>
      </MantineTable>
      <div className={styles.submitProofButton}>
        <Button
          fullWidth
          variant={VariantsEnum.outlinePrimaryFilledText}
          radius={10}
          onClick={() => {
            if (onRowClick !== undefined) onRowClick(row);
          }}
        >
          Submit Proof
        </Button>
      </div>
    </div>
  );
};

export default EarnMobileTable;
