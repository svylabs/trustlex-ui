import React from "react";
import { Button as MantineButton, ColorSwatch } from "@mantine/core";
import styles from "./Button.module.scss";
type Props = {
  children: React.ReactNode;
  indicator?: boolean;
};

const Button = ({ children, indicator }: Props) => {
  return (
    <MantineButton variant="light" className={styles.button}>
      {children} {indicator && <ColorSwatch color={"lime"} size={15} ml={10} />}
    </MantineButton>
  );
};

export default Button;
