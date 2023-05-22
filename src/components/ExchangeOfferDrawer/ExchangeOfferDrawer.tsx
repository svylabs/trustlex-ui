import { Icon } from "@iconify/react";
import { Drawer, Grid, Text } from "@mantine/core";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import { VariantsEnum } from "~/enums/VariantsEnum";
import Button from "../Button/Button";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import GradientBackgroundContainer from "../GradientBackgroundContainer/GradientBackgroundContainer";
import styles from "./ExchangeOfferDrawer.module.scss";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
import { ReactNode, useEffect, useRef, useState, useContext } from "react";
import useAutoHideScrollbar from "~/hooks/useAutoHideScrollBar";
import StepSvg, { StepFilledSvg, StepSuccessFilledSvg } from "./StepSvg";
import useDetectScrollUpDown from "~/hooks/useDetectScrollUpDown";
import Countdown from "~/utils/Countdown";
import { AppContext } from "~/Context/AppContext";
import {
  IFullfillmentEvent,
  IFullfillmentResult,
} from "~/interfaces/IOfferdata";
import {
  InitializeFullfillment,
  showSuccessMessage,
  showErrorMessage,
  getOffer,
  submitPaymentProof,
} from "~/service/AppService";
import { QRCodeCanvas } from "qrcode.react";
import { address } from "bitcoinjs-lib";
import { generateTrustlexAddress } from "~/utils/BitcoinUtils";
import ImageIcon from "../ImageIcon/ImageIcon";
import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";
import SatoshiToBtcConverter from "~/utils/SatoshiToBtcConverter";
import { ethers } from "ethers";
import { BlockchainExplorerLink } from "~/Context/AppConfig";
import { getStringForTx } from "~/helpers/commonHelper";
import { ActionIcon } from "@mantine/core";
import {
  TimeToDateFormat,
  getTimeInSeconds,
  findOrderExpireColor,
  getOfferOrderExpiryDurationInSeconds,
} from "~/utils/TimeConverter";

import {
  IconAdjustments,
  IconClipboardCopy,
  IconClipboardCheck,
  IconCopy,
} from "@tabler/icons-react";
import { Tooltip } from "@mantine/core";
import { default as Countdowntimer } from "react-countdown";
import BtcToSatoshiConverter from "~/utils/BtcToSatoshiConverter";

type Props = {
  isOpened: boolean;
  onClose: () => void;
  rowOfferId: number | null;
  account: string;
  rowFullFillmentId: string | undefined;
  contract: ethers.Contract | undefined;
  refreshOffersListKey: number;
  setRefreshOffersListKey: (refreshOffersListKey: number) => void;
  rowFullFillmentExpiryTime: string | undefined;
  setrowFullFillmentExpiryTime: (
    rowFullFillmentExpiryTime: string | undefined
  ) => void;
  rowFullFillmentQuantityRequested: string | undefined;
};

const ExchangeOfferDrawer = ({
  isOpened,
  onClose,
  account,
  rowFullFillmentId,
  contract,
  refreshOffersListKey,
  setRefreshOffersListKey,
  rowOfferId,
  rowFullFillmentExpiryTime,
  setrowFullFillmentExpiryTime,
  rowFullFillmentQuantityRequested,
}: Props) => {
  // console.log(data);
  const { mobileView } = useWindowDimensions();
  const rootRef = useRef(null);
  const context = useContext(AppContext);
  const [ethValue, setEthValue] = useState<number | string>(0);

  const [checked, setChecked] = useState("allow");
  const [activeStep, setActiveStep] = useState(1);
  const [verified, setVerified] = useState(false);
  const [confirmed, setConfirmed] = useState("");
  const [initatedata, setInitatedata]: any = useState([]);
  const [to, setTo] = useState("");
  const [planningToSell, setPlanningToSell] = useState(0);
  const [planningToBuy, setPlanningToBuy] = useState(0);
  const [submitPaymentProofTxHash, setSubmitPaymentProofTxHash] = useState("");
  const [clipboardTxCopy, setClipboardTxCopy] = useState(false);
  const [isInitiatng, setIsInitating] = useState("");
  const [offerFulfillmentId, setOfferFulfillmentId] = useState<
    string | undefined
  >(undefined);
  const [countdowntimerTime, setCountdowntimerTime] = useState<number>(0);
  const [countdowntimerKey, setCountdowntimerTimeKey] = useState<number>(0);
  const [isOrderExpired, setIsOrderExpired] = useState<boolean>(false);
  const [countDownTimeColor, setCountDownTimeColor] =
    useState<string>("inherit");
  const { scrollDirection } = useDetectScrollUpDown();

  useEffect(() => {
    if (rowOfferId === null) {
      onClose();
    }
  }, [rowOfferId]);

  if (context === null) {
    return <>Loading...</>;
  }

  const { listenedOfferData, listenedOfferDataByNonEvent } = context;

  const foundOffer =
    rowOfferId &&
    // listenedOfferData.offers.find((offer) => {
    listenedOfferDataByNonEvent.offers.find((offer) => {
      // return offer.offerDetailsInJson.offerId === data[0];
      return Number(offer.offerDetailsInJson.offerId) === Number(rowOfferId);
    });

  // console.log(foundOffer, data, listenedOfferData, listenedOfferDataByNonEvent);
  useAutoHideScrollbar(rootRef);

  useEffect(() => {
    if (!foundOffer || foundOffer === undefined) return;

    let countdowntimerTime_ = rowFullFillmentExpiryTime
      ? parseInt(rowFullFillmentExpiryTime) * 1000
      : 0;
    setCountdowntimerTime(countdowntimerTime_);
    setCountDownTimeColor(findOrderExpireColor(countdowntimerTime_));
    setCountdowntimerTimeKey(countdowntimerKey + 1);

    //check order is expired or not
    let isOrderExpired = false;
    // if (rowFullFillmentExpiryTime && countdowntimerTime_ < Date.now()) {
    //   isOrderExpired = true;
    //   setIsOrderExpired(true);
    // }

    let planningToSell_ = Number(
      ethers.utils.formatEther(foundOffer.offerDetailsInJson.offerQuantity)
    ); //offerQuantity
    let offer = foundOffer;

    const price_per_ETH_in_BTC =
      Number(
        SatoshiToBtcConverter(offer.offerDetailsInJson.satoshisToReceive)
      ) /
      Number(ethers.utils.formatEther(offer.offerDetailsInJson.offerQuantity));
    const satoshisToReceive = Number(
      offer.offerDetailsInJson.satoshisToReceive
    );
    const satoshisReserved = Number(offer.offerDetailsInJson.satoshisReserved);
    const satoshisReceived = Number(offer.offerDetailsInJson.satoshisReceived);
    let left_to_buy =
      Number(
        SatoshiToBtcConverter(
          satoshisToReceive - (satoshisReserved + satoshisReceived)
        )
      ) / price_per_ETH_in_BTC;

    setPlanningToBuy(
      Number(
        Number(
          SatoshiToBtcConverter(foundOffer.offerDetailsInJson.satoshisToReceive)
        ).toFixed(4)
      )
    );

    setIsInitating("");
    setTo("");
    setActiveStep(1);
    setVerified(false);
    setConfirmed("");

    // setPlanningToSell(planningToSell_);
    // setEthValue(planningToSell_);

    //if order already initiated
    if (rowFullFillmentId != undefined && isOrderExpired == false) {
      setIsInitating("initiated");
      let toAddress = Buffer.from(
        foundOffer.offerDetailsInJson.bitcoinAddress.substring(2),
        "hex"
      );
      let fulfillmentId = rowFullFillmentId;
      setOfferFulfillmentId(fulfillmentId);
      if (fulfillmentId.length % 2 != 0) {
        fulfillmentId = "0" + fulfillmentId;
      }
      let hashAdress = generateTrustlexAddress(toAddress, fulfillmentId);
      setTo(`${hashAdress}`);
      setActiveStep(2);

      left_to_buy =
        Number(
          SatoshiToBtcConverter(rowFullFillmentQuantityRequested as string)
        ) *
        (Number(
          ethers.utils.formatEther(offer.offerDetailsInJson.offerQuantity)
        ) /
          Number(
            SatoshiToBtcConverter(offer.offerDetailsInJson.satoshisToReceive)
          ));
    }
    setPlanningToSell(left_to_buy);
    setEthValue(left_to_buy);
  }, [foundOffer?.offerDetailsInJson?.offerId]);

  const handleInitate = async () => {
    // validate the eth value
    let buyAmount: number = ethValue as number;

    if (buyAmount <= 0) {
      showErrorMessage("Please enter buy amount greater than 0 !");
      return false;
    } else if (buyAmount > planningToSell) {
      showErrorMessage(
        `Buy amount can not be greater that offer quanity ${planningToSell} !`
      );
      return false;
    }

    setIsInitating("loading");
    let result = await initiateFullFillMent();
    if (result == false) {
      setIsInitating("");
    } else {
      setIsInitating("initiated");
    }
    // setTimeout(() => {
    //   setIsInitating("initiated");
    // }, 1000 * 120);
  };

  const initiateFullFillMent = async () => {
    if (!foundOffer || foundOffer === undefined) {
      showErrorMessage("Invalid Offer");
      return false;
    }
    if (account == "") {
      showErrorMessage("Please wait ,your account is not connected !");
      return false;
    }

    const _fulfillment: IFullfillmentEvent = {
      // fulfillmentBy: foundOffer.offerEvent.from,
      fulfillmentBy: account,
      // quantityRequested: foundOffer.offerDetailsInJson.satoshisToReceive,
      quantityRequested: BtcToSatoshiConverter(getBTCAmount()),
      allowAnyoneToSubmitPaymentProofForFee: true,
      allowAnyoneToAddCollateralForFee: true,
      totalCollateralAdded: foundOffer.offerDetailsInJson.collateralPer3Hours,
      // expiryTime: foundOffer.offerDetailsInJson.offerValidTill,
      expiryTime: getTimeInSeconds().toString(),
      fulfilledTime: 0,
      // collateralAddedBy: foundOffer.offerEvent.from,
      collateralAddedBy: account,
      paymentProofSubmitted: false,
    };

    // console.log(foundOffer, _fulfillment);

    const data = await InitializeFullfillment(
      context.contract,
      // foundOffer.offerEvent.to,
      foundOffer.offerDetailsInJson.offerId,
      _fulfillment
    );
    if (data) {
      let event = data?.events[0];
      let claimedBy = event?.args["claimedBy"];
      let offerId = event?.args["offerId"]?.toString();
      let fulfillmentId = event?.args["fulfillmentId"]?.toString();
      let expiryTime = (
        parseInt(_fulfillment.expiryTime) +
        getOfferOrderExpiryDurationInSeconds()
      ).toString();
      // console.log(event, claimedBy, offerId, fulfillmentId);
      setOfferFulfillmentId(fulfillmentId);
      let toAddress = Buffer.from(
        foundOffer.offerDetailsInJson.bitcoinAddress.substring(2),
        "hex"
      );
      if (fulfillmentId.length % 2 != 0) {
        fulfillmentId = "0" + fulfillmentId;
      }

      // console.log(fulfillmentId);
      let hashAdress = generateTrustlexAddress(toAddress, fulfillmentId);
      setTo(`${hashAdress}`);
      setInitatedata(data);
      setActiveStep(activeStep + 1);
      setrowFullFillmentExpiryTime(expiryTime);
      setCountdowntimerTime(expiryTime ? parseInt(expiryTime) * 1000 : 0);
      setCountdowntimerTimeKey(countdowntimerKey + 1);
    } else {
      return false;
    }
  };

  const handleConfirmClick = async () => {
    let offerId = foundOffer?.offerDetailsInJson.offerId;
    if (offerFulfillmentId == undefined) {
      return false;
    }
    setConfirmed("loading");
    let result = await submitPaymentProof(
      contract,
      offerId,
      offerFulfillmentId
    );
    console.log(result);
    if (result) {
      setSubmitPaymentProofTxHash(result.transactionHash);
      setConfirmed("confirmed");
      showSuccessMessage("Proof has been submitted successfully !");
      setActiveStep(4);
      setTimeout(function () {
        setRefreshOffersListKey(refreshOffersListKey + 1);
        onClose();
      }, 5000);
    } else {
      showErrorMessage("Something went wrong. Please try again later.");
      setConfirmed("");
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setClipboardTxCopy(true);
    setTimeout(function () {
      setClipboardTxCopy(false);
    }, 2000);
  };

  // useEffect(() => {
  //   if (!listenedOfferData || listenedOfferData === undefined) return;
  //   initiateFullFillMent();
  // }, [listenedOfferData]);

  if (!isOpened) return null;

  const getBTCAmount = () => {
    return Number(((ethValue / planningToSell) * planningToBuy).toFixed(3));
  };

  return (
    <Drawer
      opened={isOpened}
      onClose={onClose}
      position={!mobileView ? "right" : "bottom"}
      overlayBlur={2.5}
      overlayOpacity={0.5}
      withCloseButton={false}
      size={!mobileView ? 700 : scrollDirection === "down" ? "full" : 600}
      closeOnClickOutside={true}
      closeOnEscape={true}
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
              <Grid.Col
                span={3}
                p={0}
                pb={1}
                className={styles.cancelContainer}
              >
                <span className={styles.cancel} onClick={onClose}>
                  Cancel
                </span>
              </Grid.Col>
            )}

            <Grid.Col span={!mobileView ? 11 : 9}>
              <Text component="h1" className={styles.headTitle}>
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
            <Grid.Col span={12}>
              <div style={{ width: "100%" }}>
                <Text
                  component="h1"
                  className={styles.title}
                  style={{
                    display: "inline-block",
                    verticalAlign: "text-top",
                    margin: "0 auto",
                  }}
                >
                  <span className={styles.buy}>Buy:</span>
                  {activeStep === 1 ? (
                    <>
                      <input
                        type="number"
                        step="any"
                        min={0}
                        value={ethValue}
                        max={planningToSell}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (isNaN(value)) {
                            setEthValue("");
                          } else {
                            setEthValue(Number(value));
                          }
                          // if (isNaN(ethValue)) {
                          //   setEthValue(Number(e.target.value));
                          // }
                          // setEthValue(Number(e.target.value));
                        }}
                        className={styles.input}
                      />
                    </>
                  ) : (
                    <span style={{ marginRight: "10px" }}>{ethValue}</span>
                  )}
                  <ImageIcon
                    image={getIconFromCurrencyType(CurrencyEnum.ETH)}
                  />
                  <span className={styles.for}>with</span>
                  <CurrencyDisplay
                    amount={getBTCAmount()}
                    type={CurrencyEnum.BTC}
                  />{" "}
                </Text>

                <div
                  style={{
                    display: "inline-block",
                    verticalAlign: "text-top",
                    margin: "0 auto",
                    float: "right",
                  }}
                >
                  {rowFullFillmentExpiryTime && isOrderExpired == false ? (
                    <>
                      <span>Time Left</span>: &nbsp;
                      <span style={{ color: countDownTimeColor }}>
                        <Countdowntimer
                          date={
                            countdowntimerTime
                            // Date.now() + 10000
                          }
                          onTick={() => {
                            setCountDownTimeColor(
                              findOrderExpireColor(countdowntimerTime)
                            );
                          }}
                          key={countdowntimerKey}
                        />
                      </span>
                      <br />
                      <small>(For submiiting the payment proof)</small>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </Grid.Col>
          </Grid>

          <div className={styles.stepsConatiner}>
            <div className={styles.step}>
              <div className={styles.stepTitle}>
                <div className={styles.svg}>
                  {activeStep > 1 ? (
                    <StepSuccessFilledSvg />
                  ) : activeStep === 1 ? (
                    <StepFilledSvg />
                  ) : (
                    <StepSvg />
                  )}
                </div>
                <h2 className={styles.stepCount}>Step 1</h2>
              </div>

              <div className={styles.stepsContentsContainer}>
                <div className={styles.stepContent}>
                  <div className={styles.spacing} />
                  <div
                    className={`${styles.stepItem} ${
                      checked === "allow" && styles.activeStepItem
                    }`}
                    onClick={() => setChecked("allow")}
                  >
                    <div className={styles.checkboxContainer}>
                      <input
                        type="radio"
                        className={styles.checkbox}
                        checked={checked === "allow" ? true : false}
                        onChange={() => setChecked("allow")}
                      />
                    </div>
                    <span>
                      Allow anyone to post payment proof for 0.05% fee
                    </span>
                  </div>

                  <div
                    className={`${styles.stepItem} ${
                      checked !== "allow" && styles.activeStepItem
                    }`}
                    onClick={() => setChecked("notAllow")}
                  >
                    <div className={styles.checkboxContainer}>
                      <input
                        type="radio"
                        className={styles.checkbox}
                        checked={checked !== "allow" ? true : false}
                        onChange={() => setChecked("notAllow")}
                      />
                    </div>
                    <span>I'll do it myself(0% transaction fees)</span>
                  </div>
                  <div className={styles.spacing} />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left",
                    }}
                  >
                    <div className={styles.actionButton}>
                      {isInitiatng === "initiated" ? (
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
                          Initiated
                        </Button>
                      ) : (
                        <Button
                          variant={
                            isInitiatng === "loading"
                              ? VariantsEnum.outline
                              : VariantsEnum.outlinePrimary
                          }
                          radius={10}
                          style={{
                            backgroundColor:
                              isInitiatng === "loading"
                                ? "unset"
                                : "transparent",
                          }}
                          loading={isInitiatng === "loading" ? true : false}
                          onClick={handleInitate}
                        >
                          {isInitiatng === "loading"
                            ? "Initiating"
                            : "Initiate"}
                        </Button>
                      )}
                      {isInitiatng === "loading" ? (
                        <span className={styles.timer}>
                          <Countdown />
                        </span>
                      ) : (
                        isInitiatng !== "initiated" && (
                          <span className={styles.rightText}>
                            It will take approximately 1-3 mins
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepTitle}>
                <div className={styles.svg}>
                  {activeStep > 2 ? (
                    <StepSuccessFilledSvg />
                  ) : activeStep === 2 ? (
                    <>
                      <StepFilledSvg />
                    </>
                  ) : (
                    <StepSvg />
                  )}
                </div>
                <h2 className={styles.stepCount}>Step 2</h2>
                {/* <img src="https://chart.googleapis.com/chart?chs=225x225&chld=L|2&cht=qr&chl=bitcoin:1MoLoCh1srp6jjQgPmwSf5Be5PU98NJHgx?amount=.01%26label=Moloch.net%26message=Donation" /> */}
              </div>
              <div className={styles.stepsContentsContainer}>
                <div className={styles.stepContent}>
                  <div className={styles.spacing} />
                  <div className={styles.sendToContainer}>
                    {/* values can be set anything but should a string */}
                    {/* Can use JSON.stringify(value) to make string of any values like arrays */}
                    {/* Can use JSON.parse(value) to parse the value in arrays */}
                    {to == "" ? (
                      <>
                        <div className={styles.qrImage}>
                          {/* <QRCodeCanvas
                              value={
                                initatedata ? initatedata.to : "Random value"
                              }
                              style={{
                                width: "100%",
                                height: "100%",
                              }}
                              bgColor="#7C7C7C00"
                              fgColor="#7C7C7C"
                            /> */}
                        </div>
                        QR Code and BTC Address will shown after Step 1
                        initiation.
                      </>
                    ) : (
                      <>
                        <div className={styles.qrImage}>
                          <img
                            src={`https://chart.googleapis.com/chart?chs=250x250&chld=L|2&cht=qr&chl=bitcoin:${to}?amount=${getBTCAmount()}%26label=Trustlex%26message=Buying_Ether`}
                            className={styles.qrImage}
                          />
                        </div>
                        <div className={styles.sendTo}>
                          <span>
                            Send &nbsp;
                            <CurrencyDisplay
                              amount={getBTCAmount()}
                              type={CurrencyEnum.BTC}
                            />{" "}
                            Bitcoins To:
                          </span>
                          {mobileView ? (
                            <span className={styles.toAddress}>{to}</span>
                          ) : (
                            <span className={styles.toAddress}>{to}</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <div className={styles.colletaralTextContainer}>
                    <span
                      className={styles.colletaralText}
                    >{`Colletaral (optional)`}</span>
                    <span className={styles.colletaralText}>
                      Post 10% collateral to increase the payment confirmation
                      time by 3 more hours
                    </span>
                  </div>

                  <div className={styles.actionButton}>
                    <Button
                      variant={VariantsEnum.outlinePrimary}
                      style={{ background: "transparent" }}
                      radius={10}
                    >
                      Add Collateral
                    </Button>
                    <span className={styles.rightText}>
                      5% collateral posted already
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepTitle}>
                <div className={styles.svg}>
                  {activeStep > 3 ? (
                    <StepSuccessFilledSvg />
                  ) : activeStep === 3 ? (
                    <StepFilledSvg />
                  ) : (
                    <StepSvg />
                  )}
                </div>
                <h2 className={styles.stepCount}>Step 3</h2>
              </div>
              <div className={styles.stepsContentsContainer}>
                <div className={`${styles.stepContent} ${styles.lastContent}`}>
                  <div className={styles.spacing} />
                  <div className={styles.submitProof}>
                    <h3>Submit Proof</h3>
                    <p>
                      Submit Proof of payment before{" "}
                      <strong>
                        {TimeToDateFormat(rowFullFillmentExpiryTime)}
                      </strong>{" "}
                      or add more collateral to increase payment confirmation
                      time in order to have the ability to withdraw ETH from
                      smart contract
                    </p>
                  </div>
                  <div className={styles.spacing} />
                  <div
                    className={`${styles.stepItem} ${styles.proofCheckbox} ${
                      verified && styles.activeStepItem
                    }`}
                    onClick={() => {
                      // setVerified(!verified);
                      if (verified == false && activeStep == 2) {
                        setActiveStep(activeStep + 1);
                        setVerified(true);
                      } else if (verified == true && activeStep == 3) {
                        setActiveStep(activeStep - 1);
                        setVerified(false);
                      }
                    }}
                  >
                    <div className={styles.checkboxContainer}>
                      <input
                        type="radio"
                        className={styles.checkbox}
                        checked={verified}
                        // onChange={() => {
                        //   setVerified(true);
                        // }}
                      />
                    </div>
                    <span>I've verified the transaction details</span>
                  </div>
                  <div className={styles.spacing} />
                  <div className={styles.spacing} />
                  <div className={styles.buttonContainer}>
                    {confirmed !== "confirmed" && (
                      <Button
                        variant={
                          confirmed === "loading"
                            ? VariantsEnum.outline
                            : VariantsEnum.primary
                        }
                        fullWidth={
                          mobileView && confirmed !== "loading" ? true : false
                        }
                        radius={10}
                        style={{
                          height: "4.5rem",
                          backgroundColor:
                            confirmed === "loading"
                              ? "unset"
                              : "linear-gradient(180deg, #ffd572 0%, #febd38 100%)",
                        }}
                        disabled={
                          confirmed !== "loading" && verified === true
                            ? false
                            : true
                        }
                        loading={confirmed === "loading" ? true : false}
                        onClick={handleConfirmClick}
                      >
                        {confirmed === "loading"
                          ? "Confirmation"
                          : "Confirm payment"}
                      </Button>
                    )}
                    {confirmed === "loading" && (
                      <span className={styles.timer}>
                        <Countdown />
                      </span>
                    )}

                    {confirmed === "confirmed" && (
                      <div className={styles.confirmed}>
                        <Button
                          variant={VariantsEnum.outline}
                          radius={10}
                          style={{
                            borderColor: "#53C07F",
                            background: "unset",
                            color: "#53C07F",
                          }}
                          fullWidth={mobileView ? true : false}
                          leftIcon={
                            <Icon icon={"charm:circle-tick"} color="#53C07F" />
                          }
                        >
                          Confirmed
                        </Button>
                        <div className={styles.transactionLink}>
                          <h6>Link to your transaction</h6>
                          <div className={styles.linkBox}>
                            <span>
                              {BlockchainExplorerLink}
                              {getStringForTx(submitPaymentProofTxHash)}
                            </span>
                            <div className={styles.iconBox}>
                              <Tooltip
                                label={
                                  clipboardTxCopy == true ? "Copied" : "Copy"
                                }
                                color={
                                  clipboardTxCopy == true ? "green" : "dark"
                                }
                                withArrow
                              >
                                <ActionIcon
                                  size="lg"
                                  radius="md"
                                  variant="transparent"
                                  onClick={() => {
                                    handleCopyText(
                                      `${BlockchainExplorerLink}${submitPaymentProofTxHash}`
                                    );
                                  }}
                                >
                                  {clipboardTxCopy == true ? (
                                    <>
                                      <IconClipboardCheck
                                        size="1.625rem"
                                        className={styles.icon}
                                        color="green"
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <IconClipboardCopy
                                        size="1.625rem"
                                        className={styles.icon}
                                      />
                                    </>
                                  )}
                                </ActionIcon>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GradientBackgroundContainer>
    </Drawer>
  );
};

export default ExchangeOfferDrawer;
