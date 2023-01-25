import React, { forwardRef } from "react";
import { Button as MantineButton, ButtonProps, clsx } from "@mantine/core";
import styles from "./Button.module.scss";
import ImageIcon from "../ImageIcon/ImageIcon";
import Loading from "../Loading/Loading";
interface Props extends React.ComponentPropsWithoutRef<"button"> {
  children: React.ReactNode;
  variant?: "default" | "primary" | "outlined";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      variant,
      leftIcon,
      rightIcon,
      disabled,
      loading,
      ...props
    }: Props,
    ref
  ) => {
    return (
      <MantineButton
        ref={ref}
        {...props}
        className={clsx(styles.button, styles[`variant-${variant}`])}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        disabled={disabled}
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

export default Button;
