import "./PaperWallet.module.scss";
import React, { useRef, createRef } from "react";
import { Wallet } from "~/utils/BitcoinUtils";

const PaperWallet = React.forwardRef(
  (props: { generatedAddress: string; data: Wallet | null }, ref) => {
    let { generatedAddress, data } = props;
    let privateKey = data?.privateKey.toString("hex");
    // console.log(generatedAddress, data, privateKey);
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
              src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${generatedAddress}`}
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
              {generatedAddress}
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
