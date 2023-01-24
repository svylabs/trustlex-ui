import React, { forwardRef } from "react";
import { Button as MantineButton, ButtonProps, clsx } from "@mantine/core";
import styles from "./Button.module.scss";
interface Props extends React.ComponentPropsWithoutRef<"button"> {
  children: React.ReactNode;
  variant?: "default" | "primary";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    { children, variant, leftIcon, rightIcon, disabled, ...props }: Props,
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
        {children}
      </MantineButton>
    );
  }
);

export default Button;
