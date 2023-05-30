import React, { ReactNode, useEffect, useState } from "react";
import { Menu, Text, Button } from "@mantine/core";
import { VariantsEnum } from "~/enums/VariantsEnum";
import styles from "./OfferCurrencyDropdown.module.scss";
import ImageIcon from "../ImageIcon/ImageIcon";
import { ContractMap } from "~/Context/AppConfig";
import { currencyObjects } from "~/Context/Constants";
import IUserInputData from "~/interfaces/IUserInputData";

interface props {
  selectedToken: string;
  setSelectedToken: (selectedToken: string) => void;
  userInputData: IUserInputData;
  setUserInputData: (userInputData: IUserInputData) => void;
}
const OfferCurrencyDropdown = ({
  selectedToken,
  setSelectedToken,
  userInputData,
  setUserInputData,
}: props) => {
  const filteredCurrencies = userInputData.activeExchange
    .filter((item, index) => {
      if (item.currency !== "btc") {
        return item;
      }
    })
    .map((item) => currencyObjects[item.currency]);

  const [selectedCurrency, setSelectedCurrency] = useState<string>();
  const [selectedCurrencyIcon, setSelectedCurrencyIcon] = useState<
    string | JSX.Element
  >();

  useEffect(() => {
    console.log(selectedToken);
    setSelectedCurrency(selectedToken);
    setSelectedCurrencyIcon(currencyObjects[selectedToken.toLowerCase()].icon);
  }, [selectedToken]);

  const handleOfferCurrencyChange = (
    currency: string,
    icon: string | JSX.Element
  ) => {
    setSelectedCurrency(currency);
    setSelectedCurrencyIcon(icon);
    setSelectedToken(currency);
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          variant={"outline"}
          color="yellow"
          radius={10}
          style={{
            backgroundColor: "transparent",
            color: "white",
          }}
          leftIcon={selectedCurrencyIcon}
          size="lg"
        >
          {selectedCurrency}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {filteredCurrencies &&
          filteredCurrencies.map((value, index) => {
            return (
              <Menu.Item
                icon={<>{value.icon}</>}
                key={index}
                onClick={() => {
                  handleOfferCurrencyChange(value.label, value.icon);
                }}
              >
                {value.label}
              </Menu.Item>
            );
          })}
      </Menu.Dropdown>
    </Menu>
  );
};

export default OfferCurrencyDropdown;
