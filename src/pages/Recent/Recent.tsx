import { Box, Center } from "@mantine/core";
import React from "react";
import Button from "~/components/Button/Button";
import GradientBackgroundContainer from "~/components/GradientBackgroundContainer/GradientBackgroundContainer";
import ImageIcon from "~/components/ImageIcon/ImageIcon";
import RecentOngoingTable from "~/components/RecentOngoingTable/RecentOngoingTable";
import Table from "~/components/Table/Table";
import Tabs from "~/components/Tabs/Tabs";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import { VariantsEnum } from "~/enums/VariantsEnum";
import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";

type Props = {};

const Recent = (props: Props) => {
  return (
    <div>
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
    <div>
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
            data={[
              {
                orderNumber: 123444,
                planningToSell: {
                  amount: 10,
                  type: CurrencyEnum.ETH,
                },
                planningToBuy: {
                  amount: 0.078,
                  type: CurrencyEnum.BTC,
                },
                rateInBTC: 0.078,
                progress: "Initiated 35m ago",
                actions: {
                  cancel: () => {},
                  view: () => {},
                },
              },
              {
                orderNumber: 123444,
                planningToSell: {
                  amount: 10,
                  type: CurrencyEnum.ETH,
                },
                planningToBuy: {
                  amount: 0.078,
                  type: CurrencyEnum.BTC,
                },
                rateInBTC: 0.078,
                progress: "Submit Proof of payment",
                actions: {
                  cancel: () => {},
                  view: () => {},
                },
              },
              {
                orderNumber: 123444,
                planningToSell: {
                  amount: 10,
                  type: CurrencyEnum.ETH,
                },
                planningToBuy: {
                  amount: 0.078,
                  type: CurrencyEnum.BTC,
                },
                rateInBTC: 0.078,
                progress: "95% filled",
                actions: {
                  cancel: () => {},
                  view: () => {},
                },
              },
              {
                orderNumber: 123444,
                planningToSell: {
                  amount: 10,
                  type: CurrencyEnum.ETH,
                },
                planningToBuy: {
                  amount: 0.078,
                  type: CurrencyEnum.BTC,
                },
                rateInBTC: 0.078,
                progress: "92% filled",
                actions: {
                  cancel: () => {},
                  view: () => {},
                },
              },
              {
                orderNumber: 123444,
                planningToSell: {
                  amount: 10,
                  type: CurrencyEnum.ETH,
                },
                planningToBuy: {
                  amount: 0.078,
                  type: CurrencyEnum.BTC,
                },
                rateInBTC: 0.078,
                progress: "Submit Proof of payment",
                actions: {
                  cancel: () => {},
                  view: () => {},
                },
              },
            ]}
          />
          <br />
          <Center>
            <Button variant={VariantsEnum.outline} color="blue">
              Load more
            </Button>
          </Center>
        </Box>
      </GradientBackgroundContainer>
    </div>
  );
}
