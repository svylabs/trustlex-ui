import { Icon } from "@iconify/react";
import { Menu, TextInput } from "@mantine/core";
import React, { useState } from "react";
import Button from "../Button/Button";
import ImageIcon from "../ImageIcon/ImageIcon";
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
  const [inputValue, setInputValue] = useState(value);
  const [selectedOptionValue, setSelectedOptionValue] = useState(
    options[0]?.value
  );

  const selectedOption = options.find(
    (item) => item.value === selectedOptionValue
  );

  const disabled = options.length < 2;
  const select = (
    <Menu closeOnClickOutside>
      <Menu.Target>
        <Button
          variant="default"
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
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {options
          .filter((item) => item.value !== selectedOptionValue)
          .map((item) => (
            <Menu.Item
              key={item.value}
              onClick={() => setSelectedOptionValue(item.value)}
            >
              <Button variant="default" leftIcon={item.icon}>
                {item.label}
              </Button>
            </Menu.Item>
          ))}
      </Menu.Dropdown>
    </Menu>
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <TextInput
      classNames={styles}
      type={type}
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      label={label}
      rightSection={select}
      rightSectionWidth={100}
    />
  );
}
