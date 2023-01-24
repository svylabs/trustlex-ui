import React from "react";
import styles from "./SpanFullGridWidth.module.scss";
type Props = {
  children: React.ReactNode;
};

const SpanFullGridWidth = ({ children }: Props) => {
  return <div className={styles.root}>{children}</div>;
};

export default SpanFullGridWidth;
