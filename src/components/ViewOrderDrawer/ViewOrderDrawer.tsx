import { Icon } from "@iconify/react";
import { Box, Drawer, Grid, Text } from "@mantine/core";
import { viewOrderDrawerHistoryTableData } from "~/data/recentPage";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import { VariantsEnum } from "~/enums/VariantsEnum";
import Button from "../Button/Button";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import GradientBackgroundContainer from "../GradientBackgroundContainer/GradientBackgroundContainer";
import ViewOrderDrawerHistoryTable from "../ViewOrderDrawerHistoryTable/ViewOrderDrawerHistoryTable";
import styles from "./ViewOrderDrawer.module.scss";
type Props = {
  isOpened: boolean;
  onClose: () => void;
};

const ViewOrderDrawer = ({ isOpened, onClose }: Props) => {
  return (
    <Drawer
      opened={isOpened}
      onClose={onClose}
      position="right"
      overlayBlur={2.5}
      overlayOpacity={0.5}
      withCloseButton={false}
      size={700}
    >
      <GradientBackgroundContainer
        radius={0}
        colorLeft="#FEBD3893"
        bgImage="/images/Rectangle.svg"
      >
        <div className={styles.root}>
          <Grid>
            <Grid.Col span={11}>
              <Text component="h1" className={styles.title}>
                Buy <CurrencyDisplay amount={1} type={CurrencyEnum.BTC} /> for{" "}
                <CurrencyDisplay amount={10} type={CurrencyEnum.ETH} />
              </Text>
            </Grid.Col>
            <Grid.Col span={1}>
              <Button variant={VariantsEnum.default} onClick={onClose} p={0}>
                <Icon
                  icon="radix-icons:cross-circled"
                  className={styles.closeIcon}
                />
              </Button>
            </Grid.Col>
          </Grid>
          <Box>
            <Text className={styles.label}>Address to receive Bitcoin</Text>
            <Text className={styles.value}>
              1BoatSLRHtKNngkdXEeobR76b53LETtpyT
            </Text>
          </Box>
          <Box>
            <Text className={styles.label}>Order status</Text>
            <Text className={styles.value}>95% filled </Text>
          </Box>
          <Grid align={"center"} justify={"space-between"}>
            <Grid.Col span={9}>
              <Box>
                <Text className={styles.label}>Offer Expiry</Text>
                <Text className={styles.value}>In 23 hours </Text>
              </Box>
            </Grid.Col>
            <Grid.Col span={3}>
              <Button radius={10} variant={VariantsEnum.outlinePrimary}>
                Extend offer
              </Button>
            </Grid.Col>
          </Grid>
          <GradientBackgroundContainer colorLeft="#FFD57243">
            <ViewOrderDrawerHistoryTable
              tableCaption="History"
              cols={[
                "# of order",
                "Planning to sell",
                "Planning to buy",
                "Date",
              ]}
              data={viewOrderDrawerHistoryTableData}
            />
          </GradientBackgroundContainer>
          <Button variant={VariantsEnum.primary} fullWidth={false}>
            Cancel order
          </Button>
        </div>
      </GradientBackgroundContainer>
    </Drawer>
  );
};

export default ViewOrderDrawer;
