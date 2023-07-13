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
import { IBTCWallet } from "~/utils/BitcoinUtils";

import {
  Wallet,
  decryptWallet,
  encryptWallet,
  OfflineWallet,
} from "~/utils/BitcoinUtils";

import {
  generateBitcoinWallet,
  generateTrustlexAddress,
} from "~/utils/BitcoinUtils";

interface IInstantWallet {
  btcWalletData: IBTCWallet | undefined;
  setBTCWalletData: (btcWalletData: IBTCWallet | undefined) => void;
}

const InstantWalletWithGenerateButton = ({
  btcWalletData,
  setBTCWalletData,
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
  const [generatedBitcoinData, setGeneratedBitcoinData] =
    useState<Wallet | null>(null);
  const [generatedAddress, setGeneratedAddress] = useState<string>("");

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

    if (generatedBitcoinData === null) {
      showErrorMessage("Data is null");
      return false;
    }
    setDownload("loading");

    const encryptedDataString = encryptWallet(
      generatedBitcoinData,
      inputData.password
    );

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

    // set BTC data in state variable
    setBTCWalletData({
      publicKey: generatedBitcoinData.publicKey.toString("hex"),
      pubkeyHash: generatedBitcoinData.pubkeyHash.toString("hex"),
    });
    showSuccessMessage("Your wallet is successfully created.");

    setDownload("none");
  };

  const generateWallet = () => {
    const data = generateBitcoinWallet();
    // console.log(data, data.privateKey.toString("hex"));
    setGeneratedBitcoinData(data);

    const address = generateTrustlexAddress(data.pubkeyHash, "10");
    setGeneratedAddress(address as string);
  };
  return (
    <>
      <div className={styles.instantWalletRoot}>
        {generatedAddress == "" ? (
          <>
            <Button
              variant={VariantsEnum.outlinePrimary}
              style={{ background: "transparent" }}
              radius={10}
              onClick={generateWallet}
            >
              Create Wallet
            </Button>
          </>
        ) : (
          <>
            <div className={styles.generatedAddress}>
              <h3>Your generated address</h3>
              <p>{generatedAddress}</p>
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
                download === "loading"
                  ? VariantsEnum.outline
                  : VariantsEnum.primary
              }
              loading={download === "loading" ? true : false}
              fullWidth
              onClick={handleDownloadWalletClick}
            >
              {download === "loading"
                ? "Downloading Wallet and Save"
                : "Download Wallet and Save"}
            </Button>
            <p className={styles.subText}>
              * Please make sure you backup the wallet file and password. The
              wallet file and password are both needed to recover any funds
              received
            </p>
          </>
        )}
      </div>
    </>
  );
};
export default InstantWalletWithGenerateButton;
