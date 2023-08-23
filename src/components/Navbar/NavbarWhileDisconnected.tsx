import navbarStyles from "~/components/Navbar/Navbar.module.scss";
import styles from "~/components/MainLayout/MainLayout.module.scss";
import NavDropdownButton from "../NavDropdownButton/NavDropdownButton";
import { BaseContext } from "~/Context/BaseContext";
import { useContext, useEffect, useState } from "react";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
import { Web3Button } from "@web3modal/react";
import { useWeb3Modal } from "@web3modal/react";

import {
  connectToMetamask,
  showErrorMessage,
  getNetworkInfo,
  getEthereumObject,
} from "~/service/AppService";

interface props {
  title: string;
  description: string;
}
const NavbarWhileDisconnected = ({ title, description }: props) => {
  const { mobileView } = useWindowDimensions();
  const { open, close } = useWeb3Modal();
  const context = useContext(BaseContext);
  if (context === null) {
    return <>Loading...</>;
  }
  const { connectInfo, setConnectinfo, setAccount } = context;

  const handleWalletConnect = async () => {
    open();
  };
  const handleMetamaskConnect = async () => {
    const connect = await connectToMetamask();
    if (!connect) {
      let message: string = "Failed to connect";
      showErrorMessage(message);
    } else {
      console.log(connect);
      setConnectinfo({
        isConnected: true,
        walletName: "metamask",
        ethereumObject: getEthereumObject(),
        chainId: await getNetworkInfo(),
      });
      setAccount(connect[0]);
    }
  };
  const connectDropdownItems = [
    {
      title: "Metamask",
      href: "",
      onClick: handleMetamaskConnect,
      icon: "/icons/MetaMaskIcon.svg",
    },
    {
      title: "Wallet Connect",
      href: "",
      onClick: handleWalletConnect,
      icon: "/icons/walletConnect.svg",
    },
  ];

  return (
    <nav className={navbarStyles.navbar}>
      <div className={navbarStyles.left}>
        <h1 className={styles.layoutTitle}>{title}</h1>{" "}
        <p className={styles.layoutDesc}>{description}</p>
      </div>

      <div className={navbarStyles.right}>
        <NavDropdownButton
          title={mobileView ? "Connect" : "Connect"}
          icon="/icons/etherium.svg"
          dropdownItems={connectDropdownItems}
        />
        {/* <button onClick={() => connect()}>Connect Wallet</button> */}
        {/* <Web3Button /> */}
      </div>
    </nav>
  );
};

export default NavbarWhileDisconnected;
