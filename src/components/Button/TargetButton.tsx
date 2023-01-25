import React, { forwardRef, ReactNode } from "react";
import styles from "./Button.module.scss";
import Loading from "../Loading/Loading";

import { Button as MantineButton, ButtonProps, clsx } from "@mantine/core";
import { VariantsEnum } from "~/enums/VariantsEnum";
interface Props extends React.ComponentPropsWithoutRef<"button"> {
  children: React.ReactNode;
  variant?: VariantsEnum;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  compact?: boolean;
}

const TargetButton = forwardRef<ButtonProps, Props>(
  ({ children, loading, variant, ...props }: Props, ref): JSX.Element => {
    return (
      <MantineButton
        ref={ref as any}
        {...props}
        className={clsx(styles.button, styles[`variant-${variant}`])}
      >
        {loading && (
          <>
            <Loading /> &nbsp;{" "}
          </>
        )}
        {children}
      </MantineButton>
    );
  }
);

export default TargetButton;
