import styles from "~/components/GenerateWalletDrawer/InstantWallet/InstantWallet.module.scss";
import DrawerInput from "~/components/GenerateWalletDrawer/DrawerInput/DrawerInput";
import Button from "~/components/Button/Button";
import { VariantsEnum } from "~/enums/VariantsEnum";
import { Icon } from "@iconify/react";

const InstantWallet = () => {
  return (
    <div className={styles.instantWalletRoot}>
      <div className={styles.generatedAddress}>
        <h3>Your generated address</h3>
        <p>b1cqada7dda834aadfa99000adafaghaxww</p>
      </div>

      <DrawerInput
        type="password"
        placeholder="Enter your password"
        label="Password to encrypt wallet"
      />
      <DrawerInput
        type="password"
        placeholder="Enter your password again"
        label="Confirm password"
      />
      <Button
        variant={VariantsEnum.outlinePrimary}
        radius={10}
        compact={false}
        rightIcon={<Icon icon="radix-icons:download" fontSize={20} />}
        style={{
          height: "48px",
          backgroundColor: "transparent",
          marginTop: "16px",
        }}
        fullWidth
      >
        Download Wallet
      </Button>
      <p className={styles.subText}>
        * Please make sure you backup the wallet file and password. The wallet
        file and password are both needed to recover any funds received
      </p>
    </div>
  );
};
export default InstantWallet;
