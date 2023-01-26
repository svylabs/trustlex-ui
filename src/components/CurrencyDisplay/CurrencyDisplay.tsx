import React from "react";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";
import ImageIcon from "../ImageIcon/ImageIcon";
import styles from "./CurrencyDisplay.module.scss";

type Props = {
  amount: number;
  type: CurrencyEnum;
};

const CurrencyDisplay = ({ amount, type }: Props) => {
  return (
    <span className={styles.root}>
      {amount} <ImageIcon image={getIconFromCurrencyType(type)} />
      {type}
    </span>
  );
};

export default CurrencyDisplay;
