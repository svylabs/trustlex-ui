import styles from "./Navbar.module.scss";
import NavDropdownButton from "../NavDropdownButton/NavDropdownButton";
import { Icon } from "@iconify/react";
import { Button } from "@mantine/core";
import { useContext, useState } from "react";
import { AppContext } from "~/Context/AppContext";
import { connectToMetamask } from "~/service/AppService";
import SendBtcDrawer from "~/components/SendBtc/SendBtcDrawer/SendBtcDrawer";
import SendBtcBox from "~/components/SendBtc/SendBtcBox/SendBtcBox";
type Props = {
  toggleSidebar: () => void;
};

const Navbar = (props: Props) => {
  const context = useContext(AppContext);
  if (context === null) {
    return <>Loading...</>;
  }
  const { account, setAccount } = context;

  const handleConnect = async () => {
    if (account !== "") {
      console.log("Account already connected");
      return;
    } else {
      const connect = await connectToMetamask();
      if (!connect) {
        alert("Failed to connect");
      }
      setAccount(connect);
    }
  };

  const ethDropdownItems = [
    {
      title: account !== "" ? "Connected" : "Connect to Metamask",
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

          {/* <SendBtcBox open={showSendBtcBox} onClose={handleShowSendBtc} /> */}

          {/* Variant2 */}
          <SendBtcDrawer open={showSendBtcBox} onClose={handleShowSendBtc} />
        </div>
        <NavDropdownButton
          title="Bitcoin"
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
          title="Ethereum"
          icon="/icons/etherium.svg"
          dropdownItems={ethDropdownItems}
        />
      </div>
    </nav>
  );
};

export default Navbar;
