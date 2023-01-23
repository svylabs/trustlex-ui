import styles from "./Navbar.module.scss";
import NavDropdownButton from "../NavDropdownButton/NavDropdownButton";
type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}></div>
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
            { title: " BTC RPC URL", href: "" },
            { title: " RPC Password", href: "" },
            { title: " RPC Username", href: "" },
          ]}
        />
      </div>
    </nav>
  );
};

export default Navbar;
