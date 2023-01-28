import { Icon } from "@iconify/react";
import { Menu } from "@mantine/core";
import React, { useState } from "react";
import { VariantsEnum } from "~/enums/VariantsEnum";
import TargetButton from "../Button/TargetButton";
import Input from "../Input/Input";
import styles from "./InputWithSelect.module.scss";

interface ISelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

type Props = {
  label?: string;
  placeholder?: string;
  options: ISelectOption[];
  value?: number | string;
  type?: "number" | "text";
};

export function InputWithSelect({
  value,
  options,
  label,
  placeholder,
  type = "text",
}: Props) {
  const [selectedOptionValue, setSelectedOptionValue] = useState(
    options[0]?.value
  );

  const selectedOption = options.find(
    (item) => item.value === selectedOptionValue
  );

  const disabled = options.length < 2;
  const select = (
    <Menu closeOnClickOutside classNames={styles}>
      <Menu.Target>
        <TargetButton
          variant={VariantsEnum.default}
          leftIcon={selectedOption?.icon}
          disabled={disabled}
          rightIcon={
            !disabled && (
              <Icon
                icon={"ic:round-keyboard-arrow-down"}
                className={styles.chevronIcon}
              />
            )
          }
        >
          {selectedOption?.label}
        </TargetButton>
      </Menu.Target>
      <Menu.Dropdown>
        {options
          .filter((item) => item.value !== selectedOptionValue)
          .map((item) => (
            <Menu.Item
              key={item.value}
              onClick={() => setSelectedOptionValue(item.value)}
            >
              {item.icon} {item.label}
            </Menu.Item>
          ))}
      </Menu.Dropdown>
    </Menu>
  );


  return (
    <Input
      type={type}
      placeholder={placeholder}
      label={label}
      value={value}
      rightSection={select}
      rightSectionWidth={100}
    />
  );
}
