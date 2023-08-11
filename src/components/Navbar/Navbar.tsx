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
import {
  ethereum as WalletConnectEthereum,
  provider as walletConnectprovider,
} from "~/service/WalletConnectService";
import SendBtcDrawer from "~/components/SendBtc/SendBtcDrawer/SendBtcDrawer";
import SendBtcBox from "~/components/SendBtc/SendBtcBox/SendBtcBox";
import OfferCurrencyDropdown from "~/components/OfferCurrencyDropdown/OfferCurrencyDropdown";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
import NetworkMenu from "./NetworkMenu";
import Connectors from "~/components/Connectors/Connectors";

import {
  Wallet,
  generateBitcoinWallet,
  generateTrustlexAddress,
} from "~/utils/BitcoinUtils";
import { PaperWalletDownloadedEnum } from "~/interfaces/IExchannge";
import MyWalletDrawer from "~/components/GenerateWalletDrawer/MyWalletDrawer";

import {
  networks,
  activeExchange,
  currencyObjects,
  NetworkInfo,
} from "~/Context/Constants";
import { ethers } from "ethers";

//------------Import for wallet connect -----------------//
import { EthereumClient } from "@web3modal/ethereum";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Web3Button } from "@web3modal/react";
//------------End Import for wallet connect -----------------//
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
    btcWalletData,
    setBTCWalletData,
    isMetamaskConnected,
    connectInfo,
    setConnectinfo,
  } = context;

  //---------------------------Wallet connect hook ------------------------
  const { address, isConnected: isWalletConnectConnected } = useAccount();

  let connectedWalletImage = "";

  if (connectInfo.walletName == "wallet_connect") {
    connectedWalletImage = "/icons/walletConnect.svg";
  }
  if (connectInfo.walletName == "metamask") {
    connectedWalletImage = "/icons/MetaMaskIcon.svg";
  }
  const { disconnect } = useDisconnect();

  //---------------------------End Wallet connect hook ------------------------

  /* Start Variables for My wallet */
  const [myBTCWalletDrawerOpen, setMyBTCWalletDrawerOpen] = useState(false);

  const [paperWalletDownloaded, setPaperWalletDownloaded] =
    useState<PaperWalletDownloadedEnum>(PaperWalletDownloadedEnum.NotGenerated);
  const [generateAddress, setGenerateAddress] = useState("");
  /* End Variables for My wallet */

  const handleWalletDisconnect = async () => {
    console.log(connectInfo.walletName);
    console.log(address, isWalletConnectConnected);
    // return;
    if (connectInfo.walletName == "metamask") {
    } else if (connectInfo.walletName == "wallet_connect") {
      disconnect();
    }

    // setConnectinfo({
    //   ...connectInfo,
    //   isConnected: false,
    //   walletName: "",
    // });
    console.log("disconnected");
  };

  const disconnectDropdown = [
    {
      title: `Disconnect`,
      href: "",
      onClick: handleWalletDisconnect,
      icon: "",
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

  /*-----------Start Functions for my wallet-------------------*/

  const myWalletDrawerhandleClose = () => {
    // if (paperWalletDownloaded == PaperWalletDownloadedEnum.Generated) {
    //   showErrorMessage(
    //     "Please download the wallet first. Otherwise you will lost the payment amount! "
    //   );
    //   return false;
    // }
    setMyBTCWalletDrawerOpen(false);
  };

  const handleMyWallet = () => {
    setMyBTCWalletDrawerOpen(true);
  };

  useEffect(() => {
    // console.log(myBTCWalletDrawerOpen);
  }, [myBTCWalletDrawerOpen]);
  /*------------End Functions for my wallet-------------*/

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        {/* <Connectors /> */}
        {/* <Web3Button /> */}
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
            <div style={{ fontSize: 14 }}>
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
          <SendBtcBox
            open={showSendBtcBox}
            onClose={handleShowSendBtc}
            myBTCWalletDrawerOpen={myBTCWalletDrawerOpen}
            setMyBTCWalletDrawerOpen={setMyBTCWalletDrawerOpen}
            myWalletDrawerhandleClose={myWalletDrawerhandleClose}
            handleMyWallet={handleMyWallet}
          />
          <div className={styles.overlay}>
            <MyWalletDrawer
              onClose={myWalletDrawerhandleClose}
              open={myBTCWalletDrawerOpen}
              setMyBTCWalletDrawerOpen={setMyBTCWalletDrawerOpen}
              setPaperWalletDownloaded={setPaperWalletDownloaded}
              paperWalletDownloaded={paperWalletDownloaded}
              btcWalletData={btcWalletData}
              setBTCWalletData={setBTCWalletData}
            />
          </div>
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

        <DropdownSubmenu
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
          userInputData={userInputData}
          setUserInputData={setUserInputData}
          selectedNetwork={selectedNetwork}
          setSelectedNetwork={setSelectedNetwork}
          checkNetwork={checkNetwork}
        />

        <NavDropdownButton
          title={mobileView ? "Connected" : "Connected"}
          icon={connectedWalletImage}
          dropdownItems={disconnectDropdown}
        />
      </div>
    </nav>
  );
};

export default Navbar;
