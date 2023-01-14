import React from "react";
import styles from "./Navbar.module.scss";
import Button from "~/components/Button/Button";
type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <h2 className={styles.title}>Trustlex</h2>
        <p className={styles.tagLine}>Non custodial Bitcoin-Crypto exchange</p>
      </div>
      <div className={styles.right}>
        <Button indicator> Bitcoin </Button>
        <Button indicator> Ethereum </Button>
      </div>
    </nav>
  );
};

export default Navbar;
