import "./PaperWallet.module.scss";
import React, { useRef, createRef } from "react";
import { Wallet, OfflineWallet } from "~/utils/BitcoinUtils";

const PaperWallet = React.forwardRef(
  (
    props: {
      generatedAddress: string;
      data: Wallet | null;
      walletEncryptedData: OfflineWallet;
    },
    ref
  ) => {
    let { generatedAddress, data, walletEncryptedData } = props;

    // let privateKey = data?.privateKey.toString("hex");
    let privateKey = walletEncryptedData?.encryptedPrivateKey;
    let address = walletEncryptedData?.address;
    // console.log(privateKey, address);

    return (
      <div style={{ margin: "10px", color: "#333" }} ref={ref}>
        <h2 style={{ textAlign: "center" }}>BTC Paper Wallet</h2>
        <div
          style={{
            display: "flex",
            margin: "10px",
            padding: "20px",
            marginTop: "20px",
            border: "1px solid #ccc",
          }}
        >
          <div>
            <img
              src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${address}`}
            />
          </div>
          <div>
            <h2>Bitcoin Address</h2>

            <div
              style={{
                fontSize: "14px",
                overflowWrap: "break-word",
                textAlign: "center",
                lineHeight: "19px",
              }}
            >
              {address}
            </div>
          </div>
        </div>
        <div
          style={{
            margin: "10px",
            color: "#333",
            display: "flex",
            padding: "10px",
            marginTop: "20px",
            border: "1px solid #ccc",
          }}
        >
          <div>
            <img
              src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${privateKey}`}
            />
          </div>
          <div>
            <h2>Bitcoin Private key</h2>

            <div
              style={{
                fontSize: "14px",
                overflowWrap: "break-word",
                textAlign: "center",
                lineHeight: "19px",
              }}
            >
              {privateKey}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
export default PaperWallet;
