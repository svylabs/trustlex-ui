import React, { useState } from "react";
import { FileInput } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import styles from "~/components/GenerateWalletDrawer/ImportWallet/ImportWallet.module.scss";
import { showErrorMessage, showSuccessMessage } from "~/service/AppService";
import Button from "~/components/Button/Button";
import { VariantsEnum } from "~/enums/VariantsEnum";
import { IBTCWallet } from "~/utils/BitcoinUtils";

interface IInstantWallet {
  btcWalletData: IBTCWallet;
  setBTCWalletData: (btcWalletData: IBTCWallet) => void;
}

const ImportWallet = ({ btcWalletData, setBTCWalletData }: IInstantWallet) => {
  return (
    <div className="container">
      <p>Please upload the wallet json file.</p>
      <div style={{ margin: "20px 0px" }}>
        <Demo
          btcWalletData={btcWalletData}
          setBTCWalletData={setBTCWalletData}
        />
      </div>
    </div>
  );
};
interface ISelectFile {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

function Demo({ btcWalletData, setBTCWalletData }: IInstantWallet) {
  const [selectedFile, setSelectedFile] = useState<File | null>();
  const [isSelected, setIsSelected] = useState(false);

  const changeHandler = (event: any) => {
    let file = event.target.files[0];
    if (file.type != "application/json") {
      showErrorMessage("Invalid file type!");
      setSelectedFile(null);
      setIsSelected(false);
      event.target.value = null;
      return false;
    }
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
    // console.log(event.target.files);
  };
  const handleSubmission = () => {
    if (isSelected == false) {
      showErrorMessage("Please upload the file first");
      return false;
    }
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile as File, "UTF-8");
    fileReader.onload = (e) => {
      let fileData: any = e?.target?.result;
      fileData = JSON.parse(fileData);
      if (
        !(
          "address" in fileData &&
          "publicKey" in fileData &&
          "pubkeyHash" in fileData
        )
      ) {
        showErrorMessage("invalid file format");
        return false;
      }
      let address = fileData?.address;
      let publicKeyString = fileData?.publicKey;
      let pubkeyHashString = fileData?.pubkeyHash;

      let publicKey = Buffer.from(publicKeyString, "hex");
      let pubKeyHash = Buffer.from(pubkeyHashString, "hex");

      // set BTC data in state variable
      setBTCWalletData({
        publicKey: publicKey,
        pubkeyHash: pubKeyHash,
      });
      showSuccessMessage("You wallet is successfully imported.");
      // console.log("e.target.result", e.target.result);
      console.log(address);
    };
  };
  return (
    <>
      <div className={styles.stepsConatiner}>
        <input type="file" name="file" onChange={changeHandler} />
        {isSelected ? (
          <div style={{ margin: "20px 10px" }}>
            <p>Filename: {selectedFile?.name}</p>
            <p>Filetype: {selectedFile?.type}</p>
            <p>Size in bytes: {selectedFile?.size}</p>
            <p>
              lastModifiedDate:{" "}
              {selectedFile?.lastModifiedDate?.toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p>Select a file to show details</p>
        )}
        <div style={{ marginTop: "20px" }}>
          <Button
            variant={VariantsEnum.outlinePrimary}
            style={{ background: "transparent" }}
            radius={10}
            onClick={handleSubmission}
          >
            Import
          </Button>
        </div>
      </div>
    </>
  );
}

export default ImportWallet;
