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
import React, { useEffect, useRef } from "react";
import useAutoHideScrollbar from "~/hooks/useAutoHideScrollBar";
import { IListInitiatedFullfillmentDataByNonEvent } from "~/interfaces/IOfferdata";
import { TimeToDateFormat } from "~/utils/TimeConverter";
import { generateTrustlexAddress } from "~/utils/BitcoinUtils";
import { ethers } from "ethers";
import { useState } from "react";
import SatoshiToBtcConverter from "~/utils/SatoshiToBtcConverter";
import { IFullfillmentResult } from "~/interfaces/IOfferdata";
import {
  getInitializedFulfillmentsByOfferId,
  extendOffer,
  getOffer,
  cancelOfferService,
  showErrorMessage,
  showSuccessMessage,
} from "~/service/AppService";
import { EthtoWei, WeitoEth, tofixedEther } from "~/utils/Ether.utills";
import { TimestampTotoNow, TimestampfromNow } from "~/utils/TimeConverter";
import { tofixedBTC } from "~/utils/BitcoinUtils";
import ExtendOffer from "~/components/ExtendOffer/ExtendOffer";
import { TimeToNumber } from "~/utils/TimeConverter";
import { AppContext } from "~/Context/AppContext";
import { IOfferdata } from "~/interfaces/IOfferdata";
// ES6 Modules or TypeScript
import Swal from "sweetalert2";
// import "sweetalert2/src/sweetalert2.scss";
import "@sweetalert2/themes/dark/dark.scss";

type Props = {
  isOpened: boolean;
  onClose: () => void;
  offerData: IListInitiatedFullfillmentDataByNonEvent | undefined;
  contract: ethers.Contract | undefined;
  GetProgressText: ({ progress }: { progress: string }) => void;
  selectedCurrencyIcon: JSX.Element | string;
};

const ViewOrderDrawer = ({
  isOpened,
  onClose,
  offerData,
  contract,
  GetProgressText,
  selectedCurrencyIcon,
}: Props) => {
  const context = React.useContext(AppContext);
  if (context === null) {
    return <>Loading...</>;
  }
  const {
    getSelectedTokenContractInstance,
    account,
    refreshOffersListKey,
    setRefreshOffersListKey,
    refreshMySwapOngoingListKey,
    setRefreshMySwapOngoingListKey,
    refreshMySwapCompletedListKey,
    setRefreshMySwapCompletedListKey,
  } = context;

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

  const [confirmExtendOffer, setConfirmExtendOffer] = useState("none");
  const [cancelOffer, setCancelOffer] = useState("none");
  const [openExtendOferSection, setOpenExtendOferSection] =
    useState<boolean>(false);

  const [enableoutSideClick, setEnableoutSideClick] = useState<boolean>(true);
  useAutoHideScrollbar(rootRef);

  useEffect(() => {
    if (!offerData) {
      onClose();
      return;
    }
    let offerId_: number | string = offerData?.offerDetailsInJson.offerId;
    (async () => {
      let contractInstance = await getSelectedTokenContractInstance();
      // get offer details
      let offerDetails: IOfferdata | false | undefined = await getOffer(
        contractInstance as ethers.Contract,
        offerId_,
        account
      );
      if (offerDetails) {
        offerData.offerDetailsInJson = offerDetails as IOfferdata;
      }

      let offerExpiry = TimeToDateFormat(
        (
          parseInt(offerData?.offerDetailsInJson.offerValidTill) +
          parseInt(offerData?.offerDetailsInJson.orderedTime)
        ).toString()
      );
      setOfferExpiry(offerExpiry);
      let isCanceled = offerData?.offerDetailsInJson.isCanceled;

      if (isCanceled == true) {
        setCancelOffer("Cancelled");
      }

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
    })();
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
          let ETHAmount = tofixedEther(Number(WeitoEth(ETHAmountPricePerBTC)));
          let expiryTime = TimestampTotoNow(fulfillmentRequest.expiryTime);

          let row = {
            orderNumber: fulfillmentRequestId.toString(),
            planningToSell: {
              amount: ETHAmount,
              // type: CurrencyEnum.ETH,
              type: selectedCurrencyIcon,
            },
            planningToBuy: {
              amount: tofixedBTC(
                Number(
                  SatoshiToBtcConverter(
                    fulfillmentRequest?.quantityRequested?.toString()
                  )
                )
              ),
              type: CurrencyEnum.BTC,
            },
            date: expiryTime,
          };
          return row;
        })
      : [];
    // console.log(viewOrderDrawerHistoryTableData2_);
    SetViewOrderDrawerHistoryTableData2(viewOrderDrawerHistoryTableData2_);
  }, [fullfillmentResult]);

  const getBTCAmount = () => {
    return tofixedBTC((buyAmount / planningToSell) * planningToBuy);
  };
  const handleOnClose = () => {
    if (enableoutSideClick == true) {
      onClose();
    }
  };
  const handleExtendOffer = async () => {
    setOpenExtendOferSection(!openExtendOferSection);

    setConfirmExtendOffer("none");
  };
  const handleOfferExtend = async (valid: string) => {
    try {
      setConfirmExtendOffer("loading");
      let contractInstance = await getSelectedTokenContractInstance();

      let offerValidTill = TimeToNumber(valid);
      let offerId = offerData?.offerDetailsInJson.offerId;

      if (contractInstance && offerId) {
        let result = await extendOffer(
          contractInstance,
          offerId,
          offerValidTill
        );
        if (result) {
          setConfirmExtendOffer("confirmed");
          // get offer details
          let offerDetails: IOfferdata | false | undefined = await getOffer(
            contractInstance,
            offerId
          );
          if (offerDetails) {
            let offerValidTill = offerDetails.offerValidTill;
            let orderedTime = offerDetails.orderedTime;
            let offerExpiry = TimeToDateFormat(
              (parseInt(offerValidTill) + parseInt(orderedTime)).toString()
            );
            setTimeout(() => {
              setOfferExpiry(offerExpiry);
              setOpenExtendOferSection(!openExtendOferSection);
            }, 2000);
          }
        } else {
          setConfirmExtendOffer("none");
        }
        console.log(result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancelOfferInDrawer = async () => {
    try {
      let offerId_: number | string | undefined =
        offerData?.offerDetailsInJson.offerId;

      let isConfirmed = await SwalConfirm();
      if (isConfirmed == true) {
        setCancelOffer("loading");
        setEnableoutSideClick(false);
        let contractInstance = await getSelectedTokenContractInstance();
        if (contractInstance == false) {
          return;
        }
        console.log(offerId_);
        let result = await cancelOfferService(
          contractInstance,
          offerId_ as string
        );
        if (result) {
          setCancelOffer("Cancelled");
          showSuccessMessage("Offer has been camcelled successfully!");
          setRefreshOffersListKey(refreshOffersListKey + 1);
          setRefreshMySwapOngoingListKey(refreshMySwapOngoingListKey + 1);
          setRefreshMySwapCompletedListKey(refreshMySwapCompletedListKey + 1);
          setTimeout(() => {
            setCancelOffer("none");
            onClose();
          }, 5000);
        } else {
          setCancelOffer("none");
        }

        setEnableoutSideClick(true);
      }
    } catch (err) {
      console.log(err);
      return;
    }
  };
  const SwalConfirm = () => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, do it!",
        backdrop: false,
        width: "auto",
        background: "#242528",
      })
        .then((result) => {
          if (result.isConfirmed) {
            // Swal.fire("Deleted!", "Your file has been deleted.  ", "success");
            return resolve(true);
          } else {
            return reject(false);
          }
        })
        .catch((err) => {
          console.log(err);
          return reject(false);
        });
    });
  };
  let progress: number = offerData?.offerDetailsInJson?.progress
    ? Number(offerData.offerDetailsInJson.progress)
    : 0;
  return (
    <Drawer
      opened={isOpened}
      onClose={handleOnClose}
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
                  for {selectedCurrencyIcon} {buyAmount}
                  {/* <CurrencyDisplay amount={buyAmount} type={CurrencyEnum.ETH} /> */}
                </Text>
              ) : (
                <Text component="h1" className={styles.title}>
                  <span className={styles.buy}>Buy:</span>
                  <CurrencyDisplay amount={1} type={CurrencyEnum.BTC} />
                  <span className={styles.for}> for </span>
                  for {selectedCurrencyIcon} {buyAmount}
                  {/* <CurrencyDisplay amount={10} type={CurrencyEnum.ETH} /> */}
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
              {offerData?.offerDetailsInJson?.progress} % filled
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
              <Button
                radius={10}
                variant={
                  openExtendOferSection == false
                    ? VariantsEnum.outlinePrimary
                    : VariantsEnum.primary
                }
                style={{
                  height: openExtendOferSection == false ? "" : "36px",
                }}
                onClick={handleExtendOffer}
              >
                Extend offer
              </Button>
            </Grid.Col>
          </Grid>
          {openExtendOferSection == true ? (
            <>
              <ExtendOffer
                confirmExtendOffer={confirmExtendOffer}
                setConfirmExtendOffer={setConfirmExtendOffer}
                handleOfferExtend={handleOfferExtend}
              />
            </>
          ) : (
            <></>
          )}

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
                GetProgressText={GetProgressText}
              />
            </GradientBackgroundContainer>
          </Box>
          <div className={styles.buttonContainer}>
            {progress != 100 && (
              <>
                {cancelOffer !== "Cancelled" ? (
                  <>
                    <Button
                      radius={10}
                      style={{ height: "4.5rem" }}
                      variant={
                        cancelOffer === "loading"
                          ? VariantsEnum.outline
                          : VariantsEnum.outlinePrimary
                      }
                      loading={cancelOffer === "loading" ? true : false}
                      onClick={() => {
                        handleCancelOfferInDrawer();
                      }}
                    >
                      {confirmExtendOffer === "loading"
                        ? "Cancelled"
                        : "Cancel Order"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant={VariantsEnum.outline}
                      radius={10}
                      style={{
                        borderColor: "#53C07F",
                        background: "unset",
                        color: "#53C07F",
                      }}
                      leftIcon={
                        <Icon icon={"charm:circle-tick"} color="#53C07F" />
                      }
                    >
                      Cancelled
                    </Button>
                  </>
                )}
              </>
            )}
            {/* <Button
              variant={VariantsEnum.outlinePrimary}
              fullWidth={mobileView ? true : false}
              radius={10}
              onClick={handleCancelOfferInDrawer}
              style={{
                height: openExtendOferSection == false ? "" : "36px",
              }}
            >
              Cancel offer
            </Button> */}
          </div>
        </div>
      </GradientBackgroundContainer>
    </Drawer>
  );
};

export default ViewOrderDrawer;
