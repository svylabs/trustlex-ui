import { Box, Center } from "@mantine/core";
import ActionButton from "~/components/ActionButton/ActionButton";
import Button from "~/components/Button/Button";
import GradientBackgroundContainer from "~/components/GradientBackgroundContainer/GradientBackgroundContainer";
import RecentHistoryTable from "~/components/RecentHistoryTable/RecentHistoryTable";
import RecentOngoingTable from "~/components/RecentOngoingTable/RecentOngoingTable";
import Tabs from "~/components/Tabs/Tabs";
import { HistoryTableData, OngoingTableData } from "~/data/recentPage";
import { VariantsEnum } from "~/enums/VariantsEnum";
import styles from "./Recent.module.scss";
type Props = {};

const Recent = (props: Props) => {
  return (
    <div className={styles.root}>
      <Tabs
        tabs={[
          { label: "My Swaps", value: "my-swaps" },
          { label: "All Swaps", value: "all-swaps" },
        ]}
        panels={[
          {
            value: "my-swaps",
            children: <MySwaps />,
          },
          {
            value: "all-swaps",
            children: <h1>All Swaps</h1>,
          },
        ]}
      />
    </div>
  );
};

export default Recent;

function MySwaps() {
  return (
    <div className={styles.panelCont}>
      <GradientBackgroundContainer colorLeft="#FFD57243">
        <Box p={"lg"}>
          <RecentOngoingTable
            tableCaption="Ongoing"
            cols={[
              "# of order",
              "Planning to sell",
              "Planning to buy",
              "Price per ETH in BTC",
              "Progress",
              "Actions",
            ]}
            data={OngoingTableData}
          />
          <br />
          <Center>
            <ActionButton variant={"transparent"}>Load more</ActionButton>
          </Center>
        </Box>
      </GradientBackgroundContainer>
      <GradientBackgroundContainer colorLeft="#FFD57243">
        <Box p={"lg"}>
          <RecentHistoryTable
            tableCaption="History"
            cols={[
              "# of order",
              "Planning to sell",
              "Planning to buy",
              "Price per ETH in BTC",
              "Date",
              "Status",
            ]}
            data={HistoryTableData}
          />
          <br />
          <Center>
            <ActionButton variant={"transparent"}>Load more</ActionButton>{" "}
          </Center>
        </Box>
      </GradientBackgroundContainer>
    </div>
  );
}
