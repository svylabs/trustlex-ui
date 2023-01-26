import { Button as MantineButton, ButtonProps, clsx } from "@mantine/core";
import styles from "./Button.module.scss";
import Loading from "../Loading/Loading";
import { VariantsEnum } from "~/enums/VariantsEnum";

interface Props extends Omit<ButtonProps, "variant"> {
  variant: VariantsEnum;
  onClick?: () => void;
}

const Button = ({
  children,
  variant = VariantsEnum.default,
  loading,
  onClick,
  compact,
  fullWidth,
  ...props
}: Props) => {
  return (
    <MantineButton
      onClick={onClick}
      compact={compact}
      {...props}
      className={clsx(
        styles.button,
        styles[`variant-${variant}`],
        fullWidth && styles.fullWidth
      )}
    >
      {loading && (
        <>
          <Loading /> &nbsp;{" "}
        </>
      )}
      {children}
    </MantineButton>
  );
};

export default Button;
