import { Box, clsx } from "@mantine/core";
import React from "react";
import styles from "./GradientBackgroundContainer.module.scss";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";

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
  const { mobileView } = useWindowDimensions();
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
      <div
        className={styles.content}
        style={
          mobileView
            ? {
                maxHeight: "600px",
                overflowY: "scroll",
              }
            : {}
        }
      >
        {children}
      </div>
    </Box>
  );
};

export default GradientBackgroundContainer;
