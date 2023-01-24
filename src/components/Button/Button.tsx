import React from "react";
import { Button as MantineButton, clsx } from "@mantine/core";
import styles from "./Button.module.scss";
type Props = {
  children: React.ReactNode;
  variant?: "default" | "primary";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
};

const Button = ({
  children,
  variant,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: Props) => {
  return (
    <MantineButton
      {...props}
      className={clsx(styles.button, styles[`variant-${variant}`])}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      disabled={disabled}
    >
      {children}
    </MantineButton>
  );
};

export default Button;
