import { SelectProps } from "@mantine/core";
import styles from "./Select.module.scss";
import { Select as MantineSelect } from "@mantine/core";
import { Icon } from "@iconify/react";
const Select = ({ label, data, ...props }: SelectProps) => {
  data = data as { value: string; label: string }[];
  const defaultValue = typeof data[0] === "string" ? data[0] : data[0].value;
  return (
    <MantineSelect
      classNames={styles}
      label={label}
      data={data}
      defaultValue={defaultValue}
      rightSection={
        <Icon
          icon={"ic:round-keyboard-arrow-down"}
          className={styles.chevronIcon}
        />
      }
      {...props}
    />
  );
};

export default Select;
