import { TextInput, TextInputProps } from "@mantine/core";
import styles from "~/components/GenerateWalletDrawer/DrawerInput/DrawerInput.module.scss";

interface Props extends TextInputProps {}

const DrawerInput = ({
  placeholder,
  value,
  label,
  rightSection,
  type,
  onChange,
  ...props
}: Props) => {
  return (
    <TextInput
      {...props}
      classNames={styles}
      type={type}
      placeholder={placeholder}
      value={value}
      label={label}
      rightSection={rightSection}
      rightSectionWidth={100}
      onChange={onChange}
    />
  );
};

export default DrawerInput;
