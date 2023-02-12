import styles from "./MobileHistoryTable.module.scss";

import { ReactNode, useState } from "react";
import { Table as MantineTable, TableProps } from "@mantine/core";
import { Icon } from "@iconify/react";

interface Props extends TableProps {
  tableCaption?: string;
  cols: string[];
  data: (string | ReactNode)[][];
}

const MobileHistoryTable = ({
  tableCaption,
  data,
  cols,
  verticalSpacing = "md",
  ...props
}: Props) => {
  const totalIndex = data.length - 1;
  const [currentIndex, setCurrentIndex] = useState(0);
  const previousData = () => {
    setCurrentIndex((prevIndex) => {
      if (!(prevIndex - 1 === (0 || -1))) {
        return prevIndex - 1;
      } else {
        return prevIndex;
      }
    });
  };
  const nextData = () => {
    setCurrentIndex((prevIndex) => {
      if (totalIndex > prevIndex) {
        return prevIndex + 1;
      } else {
        return prevIndex;
      }
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <h2 className={styles.caption}>{tableCaption}</h2>

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
      </div>
      <div className={styles.tableContainer} {...props}>
        <div className={styles.colsContainer}>
          {cols.map((col, index) => (
            <span className={styles.col} key={index}>
              {col}
            </span>
          ))}
        </div>
        <div className={styles.tableBody}>
          {data[currentIndex].map((item, index) => (
            <span className={styles.tableData} key={index}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileHistoryTable;
