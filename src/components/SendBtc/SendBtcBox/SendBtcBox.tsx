import { useRef, useState } from "react";
import useDetectOutsideClick from "~/hooks/useDetectOutsideClick";
import { ISendBtcBoxProps } from "~/interfaces/ISendBtcProps";
import styles from "~/components/SendBtc/SendBtcBox/SendBtcBox.module.scss";
import { Icon } from "@iconify/react";
import DrawerInput from "~/components/GenerateWalletDrawer/DrawerInput/DrawerInput";
import Button from "~/components/Button/Button";
import { VariantsEnum } from "~/enums/VariantsEnum";

const SendBtcBox = ({
  open,
  onClose,
  myBTCWalletDrawerOpen,
  setMyBTCWalletDrawerOpen,
  myWalletDrawerhandleClose,
  handleMyWallet,
}: ISendBtcBoxProps) => {
  const sendBtcBoxRef = useRef(null);

  useDetectOutsideClick({
    ref: sendBtcBoxRef,
    callback: onClose,
  });

  const [btcAddress, setBtcAddress] = useState("");

  const handleSendBtc = () => {
    console.log(btcAddress);
    // TODO: Send BTC
  };

  return (
    <>
      {open ? (
        <>
          <div className={styles.sendBtcBox} ref={sendBtcBoxRef}>
            <div className={styles.sendBtcTop}>
              <span>Send BTC in one click</span>
              <Icon
                icon="radix-icons:cross-2"
                onClick={onClose}
                className={styles.closeIcon}
              />
            </div>
            <Button
              variant={VariantsEnum.outlinePrimary}
              radius={10}
              compact={false}
              // rightIcon={<Icon icon="ri:arrow-right-line" fontSize={20} />}
              style={{
                height: "40px",
                backgroundColor: "transparent",
                marginTop: "16px",
              }}
              fullWidth
              onClick={handleMyWallet}
            >
              My Wallet
            </Button>
            <div className={styles.inputField}>
              <DrawerInput
                value={btcAddress}
                onChange={(e) => setBtcAddress(e.target.value)}
                type="text"
                placeholder="Address to send BTC"
              />
            </div>

            <Button
              variant={VariantsEnum.outlinePrimary}
              radius={10}
              compact={false}
              rightIcon={<Icon icon="ri:arrow-right-line" fontSize={20} />}
              style={{
                height: "40px",
                backgroundColor: "transparent",
                marginTop: "16px",
              }}
              fullWidth
              onClick={handleSendBtc}
            >
              Send
            </Button>
          </div>
        </>
      ) : null}
    </>
  );
};

export default SendBtcBox;
