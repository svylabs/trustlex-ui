import React, { useState, useEffect } from "react";
import Dropdown from "rsuite/Dropdown";
import "rsuite/dist/rsuite.min.css";
import PageIcon from "@rsuite/icons/Page";
import styles from "./NavDropdownButton.module.scss";
import { SiEthereum } from "react-icons/si";
import {
  networks,
  NetworkInfo,
  activeExchange,
  currencyObjects,
} from "~/Context/Constants";
import IUserInputData from "~/interfaces/IUserInputData";
import ImageIcon from "~/components/ImageIcon/ImageIcon";

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
}

function NetworkMenu({
  selectedToken,
  setSelectedToken,
  userInputData,
  setUserInputData,
  selectedNetwork,
  setSelectedNetwork,
  checkNetwork,
}: props) {
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
    console.log(networkKey);
    //update the selected network, selected tokens , active exchange
    setSelectedToken(currency);
    setSelectedNetwork(networkKey);
    let filteredActiveExchangeData = filteredActiveExchange(networkKey);

    let userInputData_: IUserInputData = userInputData;
    userInputData_.activeExchange = filteredActiveExchangeData;
    userInputData_.selectedNetwork = networkKey;
    setUserInputData(userInputData_);

    let metamaskNetworkChainId: number = 0;
    let selectedNetworkChainID: number = Number(
      NetworkInfo[networkKey].ChainID
    );
    console.log(networkKey, selectedNetworkChainID);

    let selectedNetworkName: string = NetworkInfo[networkKey].NetworkName;
    // setTimeout(() => {
    //   checkNetwork(
    //     metamaskNetworkChainId,
    //     selectedNetworkChainID,
    //     selectedNetworkName
    //   );
    // }, 2000);
  };

  useEffect(() => {
    checkNetwork();
  }, [selectedNetwork]);

  function filteredActiveExchange(selectedNetwork: string) {
    let filteredActiveExchange = activeExchange.filter((value: any) => {
      if (value.networkKey == selectedNetwork) {
        return true;
      }
    });
    return filteredActiveExchange;
  }

  return (
    <div>
      {/* https://www.geeksforgeeks.org/react-suite-dropdown-submenu/ */}
      <Dropdown
        placement="bottomEnd"
        title={" " + selectedToken}
        icon={selectedCurrencyIcon as JSX.Element}
      >
        {networks.map((value, index) => {
          let filteredActiveExchangeData = filteredActiveExchange(
            value.networkKey
          );
          let networkKey: string = value.networkKey;
          let networkName = NetworkInfo[networkKey].NetworkName;

          return (
            <div key={index}>
              {/* <Dropdown.Item key={index}>{value.networkName}</Dropdown.Item> */}
              <Dropdown.Menu key={index} title={networkName}>
                {filteredActiveExchangeData.map((value2, index2) => {
                  let currency = value2.currency.toUpperCase();
                  let icon: JSX.Element | string =
                    currencyObjects[networkKey][value2.currency]?.icon;

                  return (
                    <div key={index + index2}>
                      <Dropdown.Item
                        onClick={(event) =>
                          handleNetworkChange(event, networkKey, currency)
                        }
                        icon={icon}
                      >
                        {" "}
                        {currency}
                      </Dropdown.Item>
                    </div>
                  );
                })}
              </Dropdown.Menu>
            </div>
          );
        })}
      </Dropdown>
    </div>
  );
}

export default NetworkMenu;
