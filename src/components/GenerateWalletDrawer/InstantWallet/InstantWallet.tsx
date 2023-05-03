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
import { PaperWalletDownloadedEnum } from "~/interfaces/IExchannge";

import {
  Wallet,
  decryptWallet,
  encryptWallet,
  OfflineWallet,
} from "~/utils/BitcoinUtils";
interface IInstantWallet {
  data: Wallet | null;
  generatedAddress: string;
  setPaperWalletDownloaded: (
    paperWalletDownloaded: PaperWalletDownloadedEnum
  ) => void;
  paperWalletDownloaded: PaperWalletDownloadedEnum;
}

const InstantWallet = ({
  data,
  generatedAddress,
  setPaperWalletDownloaded,
  paperWalletDownloaded,
}: IInstantWallet) => {
  const componentRef = useRef(null);

  const [inputData, setInputData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [walletEncryptedData, setWalletEncryptedData] = useState<OfflineWallet>(
    {
      address: "",
      publicKey: "",
      encryptedPrivateKey: "",
    }
  );
  const [paperWalletKey, setPaperWalletKey] = useState<number>(1);
  const [download, setDownload] = useState("none");

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
    // console.log("click on handleDownloadWalletClick");
    // console.log(data, inputData.password);
    setDownload("loading");

    const encryptedDataString = encryptWallet(data, inputData.password);

    setWalletEncryptedData(JSON.parse(encryptedDataString));
    setPaperWalletKey(paperWalletKey + 1);

    let encryptedPrivateKey =
      JSON.parse(encryptedDataString).encryptedPrivateKey;
    let address = JSON.parse(encryptedDataString).address.address;

    setInputData({
      password: "",
      confirmPassword: "",
    });

    if (!encryptedDataString)
      return showErrorMessage("Error encrypting wallet");
    // const decryptedData = decryptWallet(
    //   encryptedDataString,
    //   inputData.password
    // );
    // console.log("decryptedData", decryptedData);

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      encryptedDataString
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "wallet.json";

    link.click();
    window.setTimeout(function () {
      setDownload("none");
    }, 15000);
    // handlePrint();

    setPaperWalletDownloaded(PaperWalletDownloadedEnum.Downloaded);
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
        radius={10}
        compact={false}
        rightIcon={<Icon icon="radix-icons:download" fontSize={20} />}
        style={{
          height: "48px",
          backgroundColor: "transparent",
          marginTop: "16px",
        }}
        variant={
          download === "loading" ? VariantsEnum.outline : VariantsEnum.primary
        }
        loading={download === "loading" ? true : false}
        fullWidth
        onClick={handleDownloadWalletClick}
      >
        {download === "loading" ? "Downloading Wallet" : "Download Wallet"}
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
          walletEncryptedData={walletEncryptedData}
          ref={componentRef}
          key={paperWalletKey}
        />
      </div>
    </div>
  );
};
export default InstantWallet;
