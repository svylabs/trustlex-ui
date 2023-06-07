import React, { ReactNode, useEffect, useState } from "react";
import { offerValidity } from "~/data/exchangePage";
import Select from "~/components/Select/Select";
import Button from "~/components/Button/Button";
import { VariantsEnum } from "~/enums/VariantsEnum";
import { Icon } from "@iconify/react";
import styles from "./ExtendOffer.module.scss";
interface props {
  confirmExtendOffer: string;
  setConfirmExtendOffer: (confirmExtendOffer: string) => void;
  handleOfferExtend: (valid: string) => void;
}
const ExtendOffer = ({
  confirmExtendOffer,
  setConfirmExtendOffer,
  handleOfferExtend,
}: props) => {
  const [extendData, setExtendData] = useState({
    valid:
      typeof offerValidity[0] === "string"
        ? offerValidity[0]
        : offerValidity[0].value,
  });

  const handleOfferChange = (value: string) =>
    setExtendData((prev) => {
      return { ...prev, valid: value || "" };
    });

  return (
    <>
      <Select
        onChange={handleOfferChange}
        label="Offer extend for"
        data={offerValidity}
        value={extendData.valid}
        styles={{ rightSection: { pointerEvents: "none" } }}
      />
      {confirmExtendOffer !== "confirmed" ? (
        <Button
          radius={10}
          fullWidth
          style={{ height: "4.5rem" }}
          variant={
            confirmExtendOffer === "loading"
              ? VariantsEnum.outline
              : VariantsEnum.primary
          }
          loading={confirmExtendOffer === "loading" ? true : false}
          onClick={() => {
            handleOfferExtend(extendData.valid);
          }}
        >
          {confirmExtendOffer === "loading" ? "Confirming" : "Confirm"}
        </Button>
      ) : (
        <div className={styles.confirmed}>
          <Button
            variant={VariantsEnum.outline}
            radius={10}
            style={{
              borderColor: "#53C07F",
              background: "unset",
              color: "#53C07F",
            }}
            fullWidth
            leftIcon={<Icon icon={"charm:circle-tick"} color="#53C07F" />}
          >
            Confirmed
          </Button>
        </div>
      )}
    </>
  );
};
export default ExtendOffer;
