import { Box, Center } from "@mantine/core";
import React from "react";
import Button from "~/components/Button/Button";
import GradientBackgroundContainer from "~/components/GradientBackgroundContainer/GradientBackgroundContainer";
import ImageIcon from "~/components/ImageIcon/ImageIcon";
import RecentHistoryTable from "~/components/RecentHistoryTable/RecentHistoryTable";
import RecentOngoingTable from "~/components/RecentOngoingTable/RecentOngoingTable";
import Table from "~/components/Table/Table";
import Tabs from "~/components/Tabs/Tabs";
import { HistoryTableData, OngoingTableData } from "~/data/recentPage";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
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
      <GradientBackgroundContainer
        colorLeft="#FFD572be"
        bgImage="/images/Rectangle-large.png"
      >
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
            <Button variant={VariantsEnum.outline} color="blue">
              Load more
            </Button>
          </Center>
        </Box>
      </GradientBackgroundContainer>
      <GradientBackgroundContainer
        colorLeft="#FFD572"
        bgImage="/images/Rectangle-large.png"
      >
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
            <Button variant={VariantsEnum.outline}>Load more</Button>
          </Center>
        </Box>
      </GradientBackgroundContainer>
    </div>
  );
}
