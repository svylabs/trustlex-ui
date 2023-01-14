import React from "react";
import styles from "./Earn.module.scss";
type Props = {};

const Earn = (props: Props) => {
  return (
    <div className={styles.earnPage}>
      <section>
        <h3>1. Earn coins by submitting Bitcoin block headers</h3>
        <div className={styles.box}>
          <p className={styles.subTitle}>Earn 10 coins</p>
        </div>
      </section>
      <section>
        <h3>2. Earn 0.05% on transaction by submitting proof of payment</h3>
        <div className={styles.box}>SOmething</div>
      </section>
    </div>
  );
};

export default Earn;
