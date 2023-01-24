import React from "react";
import styles from "./GradientBackgroundContainer.module.scss";
type Props = {
  children: React.ReactNode;
  colorLeft?: string;
  colorRight?: string;
};

const GradientBackgroundContainer = ({
  children,
  colorLeft,
  colorRight,
}: Props) => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>{children}</div>
      <div className={styles.layer}></div>
      <div
        className={styles.gradientLayer}
        style={{ background: colorRight }}
      ></div>
    </div>
  );
};

export default GradientBackgroundContainer;
