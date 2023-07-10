import styles from "./Navbar.module.scss";
import NavDropdownButton from "../NavDropdownButton/NavDropdownButton";
import DropdownSubmenu from "../NavDropdownButton/DropdownSubmenu";
import BitcoinNodeSelectionMenu from "../BitcoinNodeSelectionMenu/BitcoinNodeSelectionMenu";
import { Icon } from "@iconify/react";
import { Button } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "~/Context/AppContext";
import {
  connectToMetamask,
  showErrorMessage,
  showSuccessMessage,
} from "~/service/AppService";
import SendBtcDrawer from "~/components/SendBtc/SendBtcDrawer/SendBtcDrawer";
import SendBtcBox from "~/components/SendBtc/SendBtcBox/SendBtcBox";
import OfferCurrencyDropdown from "~/components/OfferCurrencyDropdown/OfferCurrencyDropdown";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
import NetworkMenu from "./NetworkMenu";

import {
  networks,
  activeExchange,
  currencyObjects,
  NetworkInfo,
} from "~/Context/Constants";
import { ethers } from "ethers";
type Props = {
  toggleSidebar: () => void;
};

const Navbar = (props: Props) => {
  const context = useContext(AppContext);
  if (context === null) {
    return <>Loading...</>;
  }
  const {
    account,
    setAccount,
    balance,
    selectedToken,
    setSelectedToken,
    userInputData,
    setUserInputData,
    selectedNetwork,
    setSelectedNetwork,
    checkNetwork,
    setSelectedBitcoinNode,
    selectedBitcoinNode,
    BTCBalance,
  } = context;

  const handleConnect = async () => {
    if (account !== "" && (account as unknown as boolean) != false) {
      console.log("Account already connected");
      return;
    } else {
      const connect = await connectToMetamask();
      if (!connect) {
        let message: string = "Failed to connect";
        showErrorMessage(message);
      }

      setAccount(connect);
    }
  };

  const ethDropdownItems = [
    {
      title:
        account !== "" && (account as unknown as boolean) != false
          ? // ? `Connected to ${account} \n Balance ${balance} ETH`
            `Connected`
          : "Connect to Metamask",
      href: "",
      onClick: handleConnect,
    },
  ];

  const [showSendBtcBox, setShowSendBtcBox] = useState(false);

  const handleShowSendBtc = () => {
    setShowSendBtcBox((prev) => !prev);
  };
  const { mobileView } = useWindowDimensions();
  // console.log(selectedNetwork);
  let networkName = NetworkInfo[selectedNetwork].NetworkName;
  let contractAddress =
    currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
      ?.orderBookContractAddreess;
  // console.log(
  //   selectedNetwork,
  //   selectedToken,
  //   currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
  // );
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Button
          p={0}
          variant={"subtle"}
          color="gray"
          className={styles.menuBtn}
          onClick={props.toggleSidebar}
        >
          <Icon icon="material-symbols:menu-rounded" className={styles.icon} />
        </Button>
        {account != "" ? (
          <>
            <div style={{ fontSize: 9 }}>
              Connected To: {account} ({balance} ETH)
              <br />
              Network: {networkName}
              <br /> Contract: {contractAddress}
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      <div className={styles.left}>
        {/* <strong>Offer Currency : &nbsp;&nbsp;</strong> */}
        {/* <OfferCurrencyDropdown
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
          userInputData={userInputData}
          setUserInputData={setUserInputData}
          selectedNetwork={selectedNetwork}
          setSelectedNetwork={setSelectedNetwork}
        /> */}
        {/* <NetworkMenu
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
          userInputData={userInputData}
          setUserInputData={setUserInputData}
          selectedNetwork={selectedNetwork}
          setSelectedNetwork={setSelectedNetwork}
          checkNetwork={checkNetwork}
        /> */}
      </div>
      <div className={styles.right}>
        <div className={styles.btcNavbutton}>
          <NavDropdownButton
            title={`${BTCBalance} BTC`}
            handleNavButtonClick={handleShowSendBtc}
          />
          {/* Variant1 */}

          <SendBtcBox open={showSendBtcBox} onClose={handleShowSendBtc} />

          {/* Variant2 */}
          {/* <SendBtcDrawer open={showSendBtcBox} onClose={handleShowSendBtc} /> */}
        </div>
        {/* <NavDropdownButton
          title={mobileView ? "" : "Bitcoin"}
          icon="/icons/bitcoin.svg"
          dropdownItems={[
            {
              title: "BTC RPC URL",
              href: "",
            },
            { title: " RPC Password", href: "" },
            { title: " RPC Username", href: "" },
          ]}
        /> */}
        <BitcoinNodeSelectionMenu
          selectedBitcoinNode={selectedBitcoinNode}
          setSelectedBitcoinNode={setSelectedBitcoinNode}
        />
        {/* <NavDropdownButton
          title={mobileView ? "" : "Ethereum"}
          icon="/icons/etherium.svg"
          dropdownItems={ethDropdownItems}
        /> */}
        <DropdownSubmenu
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
          userInputData={userInputData}
          setUserInputData={setUserInputData}
          selectedNetwork={selectedNetwork}
          setSelectedNetwork={setSelectedNetwork}
          checkNetwork={checkNetwork}
        />
      </div>
    </nav>
  );
};

export default Navbar;
