import { Icon } from "@iconify/react";
import { Menu } from "@mantine/core";
import React, { useState } from "react";
import { VariantsEnum } from "~/enums/VariantsEnum";
import TargetButton from "../Button/TargetButton";
import Input from "../Input/Input";
import styles from "./InputWithSelect.module.scss";
import { AppContext } from "~/Context/AppContext";

interface ISelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

type Props = {
  label?: string;
  placeholder?: string;
  options: ISelectOption[];
  value?: number | string | any;
  type?: "number" | "text";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

export function InputWithSelect({
  value,
  options,
  label,
  placeholder,
  type = "text",
  disabled,
  onChange,
}: Props) {
  const [selectedOptionValue, setSelectedOptionValue] = useState(options[0]);
  const context = React.useContext(AppContext);
  if (context === null) {
    return <>Loading...</>;
  }

  const { setUserInputData, dropDownChange } = context;
  React.useEffect(() => {
    // console.log(options);
    setSelectedOptionValue(options[0]);
  }, [options]);
  const itemDisabled = options.length < 2;
  const select = (
    <Menu closeOnClickOutside classNames={styles}>
      <Menu.Target>
        <TargetButton
          variant={VariantsEnum.default}
          leftIcon={selectedOptionValue.icon}
          disabled={itemDisabled}
          rightIcon={
            !itemDisabled && (
              <Icon
                icon={"ic:round-keyboard-arrow-down"}
                className={styles.chevronIcon}
              />
            )
          }
        >
          {selectedOptionValue.label}
        </TargetButton>
      </Menu.Target>
      <Menu.Dropdown>
        {options
          .filter((item) => item?.value !== selectedOptionValue?.value)
          .map((item) => (
            <Menu.Item
              key={item?.value}
              onClick={() => {
                setSelectedOptionValue(item);
                if (item?.value === "limit" || item?.value === "no-limit") {
                  if (item?.value === "limit") {
                    setUserInputData((prev) => {
                      return { ...prev, setLimit: true };
                    });
                  } else {
                    setUserInputData((prev) => {
                      return { ...prev, setLimit: false };
                    });
                  }
                } else {
                  dropDownChange(
                    selectedOptionValue.label.toLowerCase(),
                    item?.label.toLowerCase()
                  );
                }
              }}
            >
              {item?.icon} {item?.label}
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
      onChange={onChange}
      disabled={disabled}
    />
  );
}
