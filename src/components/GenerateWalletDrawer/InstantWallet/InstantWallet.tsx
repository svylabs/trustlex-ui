import styles from "~/components/GenerateWalletDrawer/InstantWallet/InstantWallet.module.scss";
import DrawerInput from "~/components/GenerateWalletDrawer/DrawerInput/DrawerInput";
import Button from "~/components/Button/Button";
import { VariantsEnum } from "~/enums/VariantsEnum";
import { Icon } from "@iconify/react";
import { useState } from "react";
import PaperWallet from "./PaperWallet";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import React, { useRef } from "react";
import { showSuccessMessage, showErrorMessage } from "~/service/AppService";

import { Wallet, decryptWallet, encryptWallet } from "~/utils/BitcoinUtils";
interface IInstantWallet {
  data: Wallet | null;
  generatedAddress: string;
}

const InstantWallet = ({ data, generatedAddress }: IInstantWallet) => {
  const componentRef = useRef(null);

  const [inputData, setInputData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData((prev) => {
      return {
        ...prev,
        password: e.target.value,
      };
    });
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputData((prev) => {
      return {
        ...prev,
        confirmPassword: e.target.value,
      };
    });
  };

  const handleDownloadWalletClick = () => {
    if (inputData.password === "" || inputData.confirmPassword === "") {
      // alert("Password or Confirm Password is required");
      showErrorMessage("Password or Confirm Password is required");
      return false;
    }

    if (inputData.password !== inputData.confirmPassword) {
      showErrorMessage("Password and confirm password does not match");
      return false;
    }

    if (data === null) {
      showErrorMessage("Data is null");
      return false;
    }
    // console.log(data, inputData.password);
    // const encryptedData = encryptWallet(data, inputData.password);

    // setInputData({
    //   password: "",
    //   confirmPassword: "",
    // });

    // if (!encryptedData) return alert("Error encrypting wallet");
    // const decryptedData = decryptWallet(encryptedData, inputData.password);

    handlePrint();
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className={styles.instantWalletRoot}>
      <div className={styles.generatedAddress}>
        <h3>Your generated address</h3>
        <p>
          {generatedAddress !== ""
            ? generatedAddress
            : "b1cqada7dda834aadfa99000adafaghaxww"}
        </p>
      </div>

      <DrawerInput
        type="password"
        placeholder="Enter your password"
        label="Password to encrypt wallet"
        value={inputData.password}
        onChange={handlePasswordChange}
      />
      <DrawerInput
        type="password"
        placeholder="Enter your password again"
        label="Confirm password"
        value={inputData.confirmPassword}
        onChange={handleConfirmPasswordChange}
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
        onClick={handleDownloadWalletClick}
      >
        Download Wallet
      </Button>
      <p className={styles.subText}>
        * Please make sure you backup the wallet file and password. The wallet
        file and password are both needed to recover any funds received
      </p>

      {/* <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => componentRef.current}
      /> */}
      <div style={{ display: "none" }}>
        <PaperWallet
          generatedAddress={generatedAddress}
          data={data}
          ref={componentRef}
        />
      </div>
    </div>
  );
};
export default InstantWallet;
