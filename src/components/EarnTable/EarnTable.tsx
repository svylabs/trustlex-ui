import useWindowDimensions from "~/hooks/useWindowDimesnsion";
import Table from "../Table/Table";
import EarnMobileTable from "../EarnMobileTable/EarnMobileTable";
import styles from "./EarnTable.module.scss";

interface IProps {
  tableData: JSX.Element[][];
  handleSubmitProof: (data: (string | React.ReactNode)[]) => void;
}

const EarnTable = ({ tableData, handleSubmitProof }: IProps) => {
  if (tableData.length === 0) return null;
  const { mobileView } = useWindowDimensions();

  return (
    <div className={styles.box}>
      {!mobileView ? (
        <Table
          horizontalSpacing={"xs"}
          verticalSpacing={"md"}
          tableCaption="Earn 0.05% on transactions by submitting proof of payment"
          cols={["Planning to sell", "Planning to buy", "Earn", ""]}
          data={tableData}
          onRowClick={handleSubmitProof}
        />
      ) : (
        <EarnMobileTable
          horizontalSpacing={"xs"}
          verticalSpacing={"md"}
          tableCaption="Earn 0.05% on transactions by submitting proof of payment"
          cols={["Planning to sell", "Planning to buy", "Earn", ""]}
          data={tableData}
          onRowClick={handleSubmitProof}
        />
      )}
    </div>
  );
};

export default EarnTable;
