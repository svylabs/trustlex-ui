import React from "react";
import styles from "./SpanFullGridWidth.module.scss";
interface Props extends React.ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
}

const SpanFullGridWidth = ({ children, ...rest }: Props) => {
  return (
    <div className={styles.root} {...rest}>
      {children}
    </div>
  );
};

export default SpanFullGridWidth;
