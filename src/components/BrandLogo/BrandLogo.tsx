import React from "react";
import { Link } from "react-router-dom";
import styles from "./BrandLogo.module.scss";
type Props = {};

const BrandLogo = (props: Props) => {
  return (
    <Link to="/" className={styles.root}>
      <span className={styles.logo}>Logo</span>
      <h3 className={styles.name}>Trustlex</h3>
    </Link>
  );
};

export default BrandLogo;
