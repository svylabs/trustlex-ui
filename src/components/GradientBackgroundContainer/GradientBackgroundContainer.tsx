import { clsx } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import React, { useRef } from "react";
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
  const { ref } = useElementSize();

  return (
    <div
      className={styles.root}
      style={{ height: `${ref.current?.scrollHeight / 10}rem` }}
    >
      <div className={styles.content} ref={ref}>
        {children}
      </div>
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
    </div>
  );
};

export default GradientBackgroundContainer;
