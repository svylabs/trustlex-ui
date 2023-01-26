import { clsx } from "@mantine/core";
import React from "react";
import Loading from "../Loading/Loading";
import styles from "./ActionButton.module.scss";
type Props = {
  children: React.ReactNode;
  variant?: "primary" | "default" | "transparent";
  loading?: boolean;
  onClick?: () => void;
  size?: "default" | "compact";
};

const ActionButton = ({
  children,
  variant = "default",
  onClick,
  loading,
  size = "default",
}: Props) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        styles.root,
        styles[`variant-${variant}`],
        styles[`size-${size}`]
      )}
    >
      {loading && (
        <>
          <Loading /> &nbsp;{" "}
        </>
      )}{" "}
      {children}
    </button>
  );
};

export default ActionButton;
