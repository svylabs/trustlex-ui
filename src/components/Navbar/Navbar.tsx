import styles from "./Navbar.module.scss";
import NavDropdownButton from "../NavDropdownButton/NavDropdownButton";
import { Icon } from "@iconify/react";
import { VariantsEnum } from "~/enums/VariantsEnum";
import { Button } from "@mantine/core";
type Props = {
  toggleSidebar: () => void;
};

const Navbar = (props: Props) => {
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
        <NavDropdownButton
          title="Bitcoin"
          icon="/icons/bitcoin.svg"
          dropdownItems={[
            { title: " BTC RPC URL", href: "" },
            { title: " RPC Password", href: "" },
            { title: " RPC Username", href: "" },
          ]}
        />
        <NavDropdownButton
          title="Ethereum"
          icon="/icons/etherium.svg"
          dropdownItems={[
            { title: " Connect to Metamask", href: "" },
            // { title: " RPC Password", href: "" },
            // { title: " RPC Username", href: "" },
          ]}
        />
      </div>
    </nav>
  );
};

export default Navbar;
