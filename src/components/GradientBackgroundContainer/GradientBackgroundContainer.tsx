import { clsx } from "@mantine/core";
import React from "react";
import styles from "./GradientBackgroundContainer.module.scss";
type Props = {
  children: React.ReactNode;
  colorLeft?: string;
  colorRight?: string;
  bgImage?: string;
};

const GradientBackgroundContainer = ({
  children,
  colorLeft,
  colorRight,
  bgImage,
}: Props) => {
  return (
    <div className={styles.root}>
      <div
        className={styles.layer}
        style={{
          backgroundImage: `url(${
            bgImage || "../../../public/images/Rectangle.png"
          })`,
        }}
      ></div>
      <div
        className={clsx(styles.gradientLayer, styles.left)}
        style={{ background: colorLeft }}
      ></div>
      <div
        className={clsx(styles.gradientLayer, styles.right)}
        style={{ background: colorRight }}
      ></div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default GradientBackgroundContainer;
