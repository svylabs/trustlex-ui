import React, { useState } from "react";
import styles from "./Earn.module.scss";
import GradientBackgroundContainer from "~/components/GradientBackgroundContainer/GradientBackgroundContainer";
import ImageIcon from "~/components/ImageIcon/ImageIcon";
import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";
import { EarnTableData } from "~/data/earnPage";
import Button from "~/components/Button/Button";
import { VariantsEnum } from "~/enums/VariantsEnum";
import EarnPageGraph from "~/components/EarnPageGraph/EarnPageGraph";
import EarnTable from "~/components/EarnTable/EarnTable";
import { Box, Center } from "@mantine/core";
import ActionButton from "~/components/ActionButton/ActionButton";
type Props = {};

const Earn = (props: Props) => {
  const data = EarnTableData.map((row) => {
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
  const [tableData, setTableData] = useState(data);

  const handleSubmitProof = (data: (string | React.ReactNode)[]) => {
    console.log(data);
  };

  const [isProofTableLoading, setProofTableLoading] = useState(false);

  const loadMoreSubmitProof = () => {
    setProofTableLoading(true);
    setTimeout(() => {
      setTableData([...tableData, ...data]);
      setProofTableLoading(false);
    }, 2000);
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
          <br />
          <Center>
            <ActionButton
              variant={"transparent"}
              loading={isProofTableLoading}
              onClick={loadMoreSubmitProof}
            >
              Load more
            </ActionButton>{" "}
          </Center>
        </GradientBackgroundContainer>
      </section>
    </div>
  );
};

export default Earn;
