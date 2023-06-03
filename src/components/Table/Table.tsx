import React, { ReactNode } from "react";
import styles from "./Table.module.scss";
import { Table as MantineTable, TableProps } from "@mantine/core";
import useAutoHideScrollbar from "../../hooks/useAutoHideScrollBar";
import { AppContext } from "~/Context/AppContext";

interface Props extends TableProps {
  tableCaption?: string;
  cols: string[];
  data: (string | ReactNode)[][];
  onRowClick?: (data: string[7] | ReactNode[]) => void;
  setOffer?: any;
  addOffer?: boolean;
  OfferModal?: any;
  showAddOfferButton?: boolean;
  loadingText?: string;
}

const Table = ({
  tableCaption,
  data,
  cols,
  verticalSpacing = "md",
  onRowClick,
  setOffer,
  addOffer,
  OfferModal,
  showAddOfferButton = false,
  loadingText,
  ...props
}: Props) => {
  const tableContainerRef = React.useRef(null);

  useAutoHideScrollbar(tableContainerRef);

  const context = React.useContext(AppContext);

  if (context === null) {
    return <>Loading...</>;
  }
  return (
    <div className={styles.root}>
      {tableCaption !== "" && (
        <div className={styles.heading}>
          {showAddOfferButton ? (
            <>
              {!addOffer ? (
                <>
                  <h2 className={styles.caption}>{tableCaption}</h2>
                  <button onClick={() => setOffer(true)}>Add your offer</button>
                </>
              ) : (
                <div className={styles.font1}>Existing offers</div>
              )}
            </>
          ) : (
            <>{showAddOfferButton}</>
          )}
        </div>
      )}
      {/* {addOffer &&
        <>
          <OfferModal />
          <div className={styles.font1}>Existing offers</div>
        </>
      } */}

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
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  className={`${styles.tr} ${
                    onRowClick !== undefined && styles.pointer
                  }`}
                  key={index}
                  onClick={() => {
                    if (onRowClick !== undefined) onRowClick(row);
                  }}
                >
                  {row.map((item, index) => (
                    <td className={styles.td} key={index}>
                      {item}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: "center", fontWeight: 700 }}
                >
                  {/* {loadingText == "" ? "No record found" : ""} */}
                </td>
              </tr>
            )}
          </tbody>
        </MantineTable>
      </div>
    </div>
  );
};

export default Table;
