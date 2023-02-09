import React from "react";
import styles from "./Earn.module.scss";
import GradientBackgroundContainer from "~/components/GradientBackgroundContainer/GradientBackgroundContainer";
import ImageIcon from "~/components/ImageIcon/ImageIcon";
import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";
import { EarnTableData } from "~/data/earnPage";
import Button from "~/components/Button/Button";
import { VariantsEnum } from "~/enums/VariantsEnum";
import EarnPageGraph from "~/components/EarnPageGraph/EarnPageGraph";
import EarnTable from "~/components/EarnTable/EarnTable";
type Props = {};

const Earn = (props: Props) => {
  const tableData = EarnTableData.map((row) => {
    return [
      <div className={styles.planningCell}>
        {row.planningToSell.amount}{" "}
        <ImageIcon image={getIconFromCurrencyType(row.planningToSell.type)} />{" "}
        {row.planningToSell.type}
      </div>,
      <div className={styles.planningCell}>
        {row.planningToBuy.amount}{" "}
        <ImageIcon image={getIconFromCurrencyType(row.planningToBuy.type)} />{" "}
        {row.planningToBuy.type}
      </div>,
      <div className={styles.planningCell}>
        {row.earn.amount}{" "}
        <ImageIcon image={getIconFromCurrencyType(row.earn.type)} />{" "}
        {row.earn.type}
      </div>,
      <div className={styles.actionsCell}>
        <Button variant={VariantsEnum.outlinePrimaryFilledText} radius={10}>
          Submit Proof
        </Button>
      </div>,
    ];
  });

  const handleSubmitProof = (data: (string | React.ReactNode)[]) => {
    console.log(data);
  };

  return (
    <div className={styles.earnPage}>
      <div>
        <h1 className={styles.pageTitle}>Earn</h1>
        <p className={styles.pageDesc}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>

      <section>
        <GradientBackgroundContainer colorLeft="#FFD57243">
          <EarnPageGraph />
        </GradientBackgroundContainer>
      </section>
      <section>
        <GradientBackgroundContainer colorLeft="#FFD57243">
          <EarnTable
            tableData={tableData}
            handleSubmitProof={handleSubmitProof}
          />
        </GradientBackgroundContainer>
      </section>
    </div>
  );
};

export default Earn;
