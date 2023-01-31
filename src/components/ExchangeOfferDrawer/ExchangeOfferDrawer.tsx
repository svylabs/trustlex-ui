import { Icon } from "@iconify/react";
import { Box, Center, Drawer, Grid, ScrollArea, Text } from "@mantine/core";
import { viewOrderDrawerHistoryTableData } from "~/data/recentPage";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import { VariantsEnum } from "~/enums/VariantsEnum";
import Button from "../Button/Button";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import GradientBackgroundContainer from "../GradientBackgroundContainer/GradientBackgroundContainer";
import ViewOrderDrawerHistoryTable from "../ViewOrderDrawerHistoryTable/ViewOrderDrawerHistoryTable";
import styles from "./ExchangeOfferDrawer.module.scss";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
import { ReactNode, useRef } from "react";
import useAutoHideScrollbar from "~/hooks/useAutoHideScrollBar";
type Props = {
  isOpened: boolean;
  onClose: () => void;
  data: (string | ReactNode)[];
};

const ExchangeOfferDrawer = ({ isOpened, onClose, data }: Props) => {
  const { height, width } = useWindowDimensions();
  let mobileView: boolean = width !== null && width < 500 ? true : false;
  const rootRef = useRef(null);

  useAutoHideScrollbar(rootRef);
  console.log(data);

  return (
    <Drawer
      opened={isOpened}
      onClose={onClose}
      position="right"
      overlayBlur={2.5}
      overlayOpacity={0.5}
      withCloseButton={false}
      size={800}
    >
      <GradientBackgroundContainer
        radius={0}
        colorLeft={mobileView ? "" : "#FEBD3893"}
        colorRight={mobileView ? "#FEBD3838" : ""}
        bgImage="/images/Rectangle.svg"
      >
        <div className={styles.root} ref={rootRef}>
          <Grid className={styles.heading}>
            {mobileView && (
              <Grid.Col span={3} p={0} pb={1}>
                <span className={styles.cancel} onClick={onClose}>
                  Cancel
                </span>
              </Grid.Col>
            )}

            <Grid.Col span={!mobileView ? 11 : 8}>
              <Text component="h1" className={styles.title}>
                Initiate your order
              </Text>
            </Grid.Col>
            {!mobileView && (
              <Grid.Col span={1}>
                <Button variant={VariantsEnum.default} onClick={onClose} p={0}>
                  <Icon
                    icon="radix-icons:cross-circled"
                    className={styles.closeIcon}
                  />
                </Button>
              </Grid.Col>
            )}
          </Grid>
          <Grid className={styles.heading}>
            <Grid.Col span={11}>
              <Text component="h1" className={styles.title}>
                <span className={styles.buy}>Buy:</span>{" "}
                <CurrencyDisplay amount={10} type={CurrencyEnum.ETH} />
                <span className={styles.for}>with</span>
                <CurrencyDisplay amount={0.5} type={CurrencyEnum.BTC} />{" "}
              </Text>
            </Grid.Col>
          </Grid>
          {/* <Box>
            <Text className={styles.label}>Address to receive Bitcoin</Text>
            <Text className={styles.value}>
              1BoatSLRHtKNngkdXEeobR76b53LETtpyT
            </Text>
          </Box>
          <Box>
            <Text className={styles.label}>Order status</Text>
            <Text className={styles.value}>95% filled </Text>
          </Box>
          <Grid className={styles.offerExpire}>
            <Grid.Col span={"auto"} className={styles.data}>
              <Box>
                <Text className={styles.label}>Offer Expiry</Text>
                <Text className={styles.value}>In 23 hours </Text>
              </Box>
            </Grid.Col>
            <Grid.Col span={"content"} className={styles.button}>
              <Button radius={10} variant={VariantsEnum.outlinePrimary}>
                Extend offer
              </Button>
            </Grid.Col>
          </Grid>
          <Box className={styles.table}>
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
          </Box> */}
          <div className={styles.buttonContainer}>
            <Button
              variant={VariantsEnum.primary}
              fullWidth={mobileView ? true : false}
              radius={10}
              onClick={onClose}
            >
              Confirm payment
            </Button>
          </div>
        </div>
      </GradientBackgroundContainer>
    </Drawer>
  );
};

export default ExchangeOfferDrawer;
