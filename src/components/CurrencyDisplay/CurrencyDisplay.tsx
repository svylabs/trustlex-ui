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
      {amount}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ImageIcon image={getIconFromCurrencyType(type)} />
        &nbsp;
        {type}
      </div>
    </span>
  );
};

export default CurrencyDisplay;
