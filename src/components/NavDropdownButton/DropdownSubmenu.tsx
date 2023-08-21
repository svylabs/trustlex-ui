import { Icon } from "@iconify/react";
import styles from "./DropdownSubmenu.module.scss";
import navDropdownStyles from "./NavDropdownStyles.module.scss";

import { Menu, Button, createStyles } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

import React, { useState, useEffect } from "react";
import PageIcon from "@rsuite/icons/Page";
import { SiEthereum } from "react-icons/si";
import {
  networks,
  NetworkInfo,
  activeExchange,
  currencyObjects,
} from "~/Context/Constants";
import IUserInputData from "~/interfaces/IUserInputData";
import { IConnectInfo } from "~/interfaces/INetworkInfo";

interface INavDropdown {
  icon?: string;
  title: string;
  handleNavButtonClick?: () => void;
  dropdownItems?: {
    title: string;
    href: string;
    inputField?: React.ReactNode;
    onClick?: () => void;
  }[];
}

const useStyles = createStyles((theme) => ({
  item: {
    "&[data-hovered]": {
      backgroundColor:
        theme.colors[theme.primaryColor][theme.fn.primaryShade()],
      color: theme.white,
    },
  },
}));

interface props {
  selectedToken: string;
  setSelectedToken: (selectedToken: string) => void;
  userInputData: IUserInputData;
  setUserInputData: (userInputData: IUserInputData) => void;
  selectedNetwork: string;
  setSelectedNetwork: (selectedNetwork: string) => void;
  checkNetwork: (
    metamaskNetworkChainId?: number,
    selectedNetworkChainID?: number,
    selectedNetworkName?: string
  ) => void;
  connectInfo: IConnectInfo;
}

const DropdownSubmenu = ({
  selectedToken,
  setSelectedToken,
  userInputData,
  setUserInputData,
  selectedNetwork,
  setSelectedNetwork,
  checkNetwork,
  connectInfo,
}: props) => {
  const [selectedCurrencyIcon, setSelectedCurrencyIcon] = useState<
    string | JSX.Element
  >();
  useEffect(() => {
    // console.log(selectedNetwork);
    // console.log(setSelectedNetwork);
    setSelectedCurrencyIcon(
      currencyObjects[selectedNetwork][selectedToken.toLowerCase()]?.icon
    );
  }, [selectedToken]);

  const handleNetworkChange = (
    event: any,
    networkKey: string,
    currency: string //it should be in upper case
  ) => {
    // console.log(networkKey);
    //update the selected network, selected tokens , active exchange
    setSelectedToken(currency);
    setSelectedNetwork(networkKey);
    let includeNonEthereumToken = true;
    let filteredActiveExchangeData = filteredActiveExchange(
      networkKey,
      includeNonEthereumToken
    );
    // console.log(filteredActiveExchangeData);
    let userInputData_: IUserInputData = userInputData;
    userInputData_.activeExchange = filteredActiveExchangeData;
    userInputData_.selectedNetwork = networkKey;
    setUserInputData(userInputData_);

    let metamaskNetworkChainId: number = 0;
    let selectedNetworkChainID: number = Number(
      NetworkInfo[networkKey].ChainID
    );
  };

  useEffect(() => {
    checkNetwork();
  }, [selectedNetwork]);

  function filteredActiveExchange(
    selectedNetwork: string,
    includeNonEthereumToken = false
  ) {
    // console.log(activeExchange);
    let filteredActiveExchange: any = activeExchange.filter((value: any) => {
      if (
        value.networkKey == selectedNetwork ||
        (includeNonEthereumToken == true && value.isEthereumCahin == false)
      ) {
        return true;
      }
    });
    // console.log(filteredActiveExchange);
    return filteredActiveExchange;
  }

  let icon: JSX.Element = selectedCurrencyIcon as JSX.Element;
  let title: string = " " + selectedToken;

  return (
    <div className={styles.root}>
      <Menu classNames={navDropdownStyles}>
        <Menu.Target>
          <div className={styles.navButton}>
            {icon}
            {title !== "" && <span className={styles.title}>{title}</span>}
            <Icon
              icon={"ic:round-keyboard-arrow-down"}
              className={styles.chevronIcon}
            />
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          {networks.map((value, index) => {
            let filteredActiveExchangeData = filteredActiveExchange(
              value.networkKey
            );
            let networkKey: string = value.networkKey;
            let networkName: string = NetworkInfo[networkKey].NetworkName;
            if (connectInfo.walletName == "wallet_connect") {
              let ChainID: number = NetworkInfo[networkKey].ChainID;
              if (connectInfo.chainId != ChainID) {
                return;
              }
            }
            return (
              <Menu.Item
                key={index}
                rightSection={<></>}
                component={() => {
                  return Demo(
                    networkName,
                    networkKey,
                    filteredActiveExchangeData,
                    handleNetworkChange
                  );
                }}
              >
                {"item.title"}
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export function Demo(
  title: string,
  networkKey: string,
  filteredActiveExchangeData: any,
  handleNetworkChange: (
    event: any,
    networkKey: string,
    currency: string
  ) => void
) {
  const { classes } = useStyles();
  return (
    <div className={styles.root}>
      <Menu
        // classNames={classes}
        classNames={navDropdownStyles}
        width={200}
        shadow="md"
        position="left-start"
        trigger="hover"
      >
        <Menu.Target>
          <div className={styles.navButton}>
            {title}
            <Icon
              icon={"ic:round-keyboard-arrow-down"}
              className={styles.chevronIcon}
            />
          </div>
        </Menu.Target>

        <Menu.Dropdown>
          {filteredActiveExchangeData.map((value2: any, index2: number) => {
            let currency = value2.currency.toUpperCase();
            let icon: JSX.Element | string =
              currencyObjects[networkKey][value2.currency]?.icon;
            return (
              <Menu.Item
                key={index2}
                onClick={(event) =>
                  handleNetworkChange(event, networkKey, currency)
                }
                rightSection={icon}
                // component="a" href="https://mantine.dev"
              >
                {" "}
                {currency}
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}

export default DropdownSubmenu;
