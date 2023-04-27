import styles from "./Navbar.module.scss";
import NavDropdownButton from "../NavDropdownButton/NavDropdownButton";
import { Icon } from "@iconify/react";
import { Button } from "@mantine/core";
import { useContext, useState } from "react";
import { AppContext } from "~/Context/AppContext";
import {
  connectToMetamask,
  showErrorMessage,
  showSuccessMessage,
} from "~/service/AppService";
import SendBtcDrawer from "~/components/SendBtc/SendBtcDrawer/SendBtcDrawer";
import SendBtcBox from "~/components/SendBtc/SendBtcBox/SendBtcBox";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
type Props = {
  toggleSidebar: () => void;
};

const Navbar = (props: Props) => {
  const context = useContext(AppContext);
  if (context === null) {
    return <>Loading...</>;
  }
  const { account, setAccount, balance } = context;

  const handleConnect = async () => {
    if (account !== "" && (account as unknown as boolean) != false) {
      console.log("Account already connected");
      return;
    } else {
      const connect = await connectToMetamask();
      if (!connect) {
        let message: string = "Failed to connect";
        // alert("Failed to connect");
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
    // { title: " RPC Password", href: "" },
    // { title: " RPC Username", href: "" },
  ];
  const [showSendBtcBox, setShowSendBtcBox] = useState(false);

  const handleShowSendBtc = () => {
    setShowSendBtcBox((prev) => !prev);
  };
  const { mobileView } = useWindowDimensions();

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
      </div>
      <div className={styles.right}>
        <div className={styles.btcNavbutton}>
          <NavDropdownButton
            title="0.5 BTC"
            handleNavButtonClick={handleShowSendBtc}
          />
          {/* Variant1 */}

          <SendBtcBox open={showSendBtcBox} onClose={handleShowSendBtc} />

          {/* Variant2 */}
          {/* <SendBtcDrawer open={showSendBtcBox} onClose={handleShowSendBtc} /> */}
        </div>
        <NavDropdownButton
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
        />
        <NavDropdownButton
          title={mobileView ? "" : "Ethereum"}
          icon="/icons/etherium.svg"
          dropdownItems={ethDropdownItems}
        />
      </div>
    </nav>
  );
};

export default Navbar;
