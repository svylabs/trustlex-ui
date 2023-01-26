import { Box, clsx } from "@mantine/core";
import React from "react";
import styles from "./GradientBackgroundContainer.module.scss";
type Props = {
  children: React.ReactNode;
  colorLeft?: string;
  colorRight?: string;
  bgImage?: string;
  radius?: number;
};

const GradientBackgroundContainer = ({
  children,
  colorLeft,
  colorRight,
  bgImage,
  radius = 20,
}: Props) => {
  return (
    <Box className={styles.root} sx={{ borderRadius: radius }}>
      <div className={styles.layer}></div>
      <div
        className={clsx(styles.gradientLayer, styles.left)}
        style={{ background: colorLeft }}
      ></div>
      <div
        className={clsx(styles.gradientLayer, styles.right)}
        style={{ background: colorRight }}
      ></div>
      <div className={styles.content}>{children}</div>
    </Box>
  );
};

export default GradientBackgroundContainer;
