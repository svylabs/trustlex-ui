import React from "react";
import styles from "./ExchangeGridLayout.module.scss";
type Props = {
  left: React.ReactNode;
  middle: React.ReactNode;
  right: React.ReactNode;
};

const ExchangeGridLayout = ({ left, middle, right }: Props) => {
  return (
    <div className={styles.root}>
      <div className={styles.left}>{left}</div>
      <div className={styles.middle}>{middle}</div>
      <div className={styles.right}>{right}</div>
    </div>
  );
};

export default ExchangeGridLayout;
