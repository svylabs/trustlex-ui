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
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
import { useEffect, useRef } from "react";
import useAutoHideScrollbar from "~/hooks/useAutoHideScrollBar";
import { IListInitiatedFullfillmentDataByNonEvent } from "~/interfaces/IOfferdata";
import { TimeToDateFormat } from "~/utils/TimeConverter";
import { generateTrustlexAddress } from "~/utils/BitcoinUtils";
import { ethers } from "ethers";
import { useState } from "react";
import SatoshiToBtcConverter from "~/utils/SatoshiToBtcConverter";
import { IFullfillmentResult } from "~/interfaces/IOfferdata";
import { getInitializedFulfillmentsByOfferId } from "~/service/AppService";
import { EthtoWei, WeitoEth } from "~/utils/Ether.utills";
import { TimestampTotoNow, TimestampfromNow } from "~/utils/TimeConverter";
import { tofixedBTC } from "~/utils/BitcoinUtils";

type Props = {
  isOpened: boolean;
  onClose: () => void;
  offerData: IListInitiatedFullfillmentDataByNonEvent | undefined;
  contract: ethers.Contract | undefined;
};

const ViewOrderDrawer = ({ isOpened, onClose, offerData, contract }: Props) => {
  const { width } = useWindowDimensions();
  let mobileView: boolean = width !== null && width < 500 ? true : false;
  const rootRef = useRef(null);
  const [buyAmount, setBuyAmount] = useState<number>(0);
  const [planningToSell, setPlanningToSell] = useState<number>(0);
  const [planningToBuy, setPlanningToBuy] = useState<number>(0);
  const [hashAddress, setHashAddress] = useState<string>("");
  const [offerExpiry, setOfferExpiry] = useState<string>("");
  const [fullfillmentResult, setFullfillmentResult] = useState<
    IFullfillmentResult[]
  >([]);
  const [
    viewOrderDrawerHistoryTableData2,
    SetViewOrderDrawerHistoryTableData2,
  ] = useState<any[]>();

  useAutoHideScrollbar(rootRef);
  useEffect(() => {
    if (!offerData) {
      onClose();
      return;
    }
    let offerExpiry = TimeToDateFormat(
      (
        parseInt(offerData?.offerDetailsInJson.offerValidTill) +
        parseInt(offerData?.offerDetailsInJson.orderedTime)
      ).toString()
    );
    setOfferExpiry(offerExpiry);
    let offerId_: number | string = offerData?.offerDetailsInJson.offerId;

    if (offerData?.offerDetailsInJson) {
      let toAddress = Buffer.from(
        offerData.offerDetailsInJson.bitcoinAddress.substring(2),
        "hex"
      );
      let offerId = offerId_;
      offerId_ = Number(offerId_);
      if (offerId.length % 2 != 0) {
        offerId = "0" + offerId;
      }
      let hashAddress = generateTrustlexAddress(toAddress, offerId);
      setHashAddress(hashAddress as string);
      let planningToSell_ = Number(
        ethers.utils.formatEther(offerData.offerDetailsInJson.offerQuantity)
      ); //offerQuantity
      setPlanningToSell(planningToSell_);
      setBuyAmount(planningToSell_);
      setPlanningToBuy(
        tofixedBTC(
          Number(
            SatoshiToBtcConverter(
              offerData.offerDetailsInJson.satoshisToReceive
            )
          )
        )
      );
      (async () => {
        // get the Fulfillments By OfferId
        let FullfillmentResult: IFullfillmentResult[] =
          await getInitializedFulfillmentsByOfferId(
            contract,
            offerId_ as number
          );
        console.log(FullfillmentResult);
        setFullfillmentResult(FullfillmentResult);
      })();
    }
  }, [offerData?.offerDetailsInJson.offerId]);

  useEffect(() => {
    let viewOrderDrawerHistoryTableData2_ = fullfillmentResult
      ? fullfillmentResult.map((value, index) => {
          let fulfillmentRequest = value.fulfillmentRequest;
          let fulfillmentRequestId = value.fulfillmentRequestId;
          let ETHAmountPricePerBTC: string = (
            Number(fulfillmentRequest?.quantityRequested?.toString()) *
            (Number(offerData?.offerDetailsInJson.offerQuantity) /
              Number(offerData?.offerDetailsInJson.satoshisToReceive))
          ).toString();
          let ETHAmount = WeitoEth(ETHAmountPricePerBTC);
          let expiryTime = TimestampTotoNow(fulfillmentRequest.expiryTime);

          let row = {
            orderNumber: fulfillmentRequestId.toString(),
            planningToSell: {
              amount: ETHAmount,
              type: CurrencyEnum.ETH,
            },
            planningToBuy: {
              amount: SatoshiToBtcConverter(
                fulfillmentRequest?.quantityRequested?.toString()
              ),
              type: CurrencyEnum.BTC,
            },
            date: expiryTime,
          };
          return row;
        })
      : [];
    console.log(viewOrderDrawerHistoryTableData2_);
    SetViewOrderDrawerHistoryTableData2(viewOrderDrawerHistoryTableData2_);
  }, [fullfillmentResult]);

  const getBTCAmount = () => {
    return tofixedBTC((buyAmount / planningToSell) * planningToBuy);
  };

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
        colorLeft={mobileView ? "" : "#FEBD3893"}
        colorRight={mobileView ? "#FEBD3838" : ""}
        bgImage="/images/Rectangle.svg"
      >
        <div className={styles.root} ref={rootRef}>
          {mobileView && (
            <span className={styles.cancel} onClick={onClose}>
              Cancel
            </span>
          )}
          <Grid className={styles.heading}>
            <Grid.Col span={11}>
              {!mobileView ? (
                <Text component="h1" className={styles.title}>
                  Buy{" "}
                  <CurrencyDisplay
                    amount={getBTCAmount()}
                    type={CurrencyEnum.BTC}
                  />{" "}
                  for{" "}
                  <CurrencyDisplay amount={buyAmount} type={CurrencyEnum.ETH} />
                </Text>
              ) : (
                <Text component="h1" className={styles.title}>
                  <span className={styles.buy}>Buy:</span>
                  <CurrencyDisplay amount={1} type={CurrencyEnum.BTC} />
                  <span className={styles.for}> for </span>
                  <CurrencyDisplay amount={10} type={CurrencyEnum.ETH} />
                </Text>
              )}
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
          <Box>
            <Text className={styles.label}>Address to receive Bitcoin</Text>
            <Text className={styles.value}>
              {/* 1BoatSLRHtKNngkdXEeobR76b53LETtpyT{" "} */}
              <span className={styles.toAddress}>{hashAddress}</span>
            </Text>
          </Box>
          <Box>
            <Text className={styles.label}>Order status</Text>
            <Text className={styles.value}>
              {offerData?.offerDetailsInJson?.progress}
            </Text>
          </Box>
          <Grid className={styles.offerExpire}>
            <Grid.Col span={"auto"} className={styles.data}>
              <Box>
                <Text className={styles.label}>Offer Expiry</Text>
                <Text className={styles.value}>{offerExpiry} </Text>
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
                data={viewOrderDrawerHistoryTableData2}
              />
            </GradientBackgroundContainer>
          </Box>
          <div className={styles.buttonContainer}>
            <Button
              variant={VariantsEnum.primary}
              fullWidth={mobileView ? true : false}
              radius={10}
              onClick={onClose}
            >
              Cancel order
            </Button>
          </div>
        </div>
      </GradientBackgroundContainer>
    </Drawer>
  );
};

export default ViewOrderDrawer;
