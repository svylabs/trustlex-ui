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
import StepSvg, { StepFilledSvg } from "./StepSvg";
import useDetectScrollUpDown from "~/hooks/useDetectScrollUpDown";
import Countdown from "~/utils/Countdown";
import { AppContext } from "~/Context/AppContext";
import { IFullfillmentEvent } from "~/interfaces/IOfferdata";
import {
  InitializeFullfillment,
  showSuccessMessage,
  showErrorMessage,
} from "~/service/AppService";
import { QRCodeCanvas } from "qrcode.react";
import { address } from "bitcoinjs-lib";
import { generateTrustlexAddress } from "~/utils/BitcoinUtils";
import ImageIcon from "../ImageIcon/ImageIcon";
import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";
import SatoshiToBtcConverter from "~/utils/SatoshiToBtcConverter";
import { ethers } from "ethers";

type Props = {
  isOpened: boolean;
  onClose: () => void;
  data: any;
};

const ExchangeOfferDrawer = ({ isOpened, onClose, data }: Props) => {
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

  useEffect(() => {
    if (data === null) {
      onClose();
    }
  }, [data]);

  if (context === null) {
    return <>Loading...</>;
  }

  const { listenedOfferData } = context;

  const foundOffer =
    data &&
    listenedOfferData.offers.find((offer) => {
      // return offer.offerDetailsInJson.offeredBlockNumber === data[0]
      return offer.offerEvent.to.toString() == data[0];
    });

  // console.log(foundOffer, data, listenedOfferData);
  useAutoHideScrollbar(rootRef);

  const [isInitiatng, setIsInitating] = useState("");
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
    await initiateFullFillMent();
    setIsInitating("initiated");

    // setTimeout(() => {
    //   setIsInitating("initiated");
    // }, 1000 * 120);
  };

  const handleConfirmClick = () => {
    setConfirmed("loading");
    setTimeout(() => {
      setConfirmed("confirmed");
    }, 1000 * 120);
  };

  const { scrollDirection } = useDetectScrollUpDown();

  const initiateFullFillMent = async () => {
    // console.log(foundOffer);
    if (!foundOffer || foundOffer === undefined) return;
    const _fulfillment: IFullfillmentEvent = {
      fulfillmentBy: foundOffer.offerEvent.from,
      quantityRequested: foundOffer.offerDetailsInJson.satoshisToReceive,
      allowAnyoneToSubmitPaymentProofForFee: true,
      allowAnyoneToAddCollateralForFee: true,
      totalCollateralAdded: foundOffer.offerDetailsInJson.collateralPer3Hours,
      expiryTime: foundOffer.offerDetailsInJson.offerValidTill,
      fulfilledTime: 10,
      collateralAddedBy: foundOffer.offerEvent.from,
    };

    console.log(foundOffer, _fulfillment);

    const data = await InitializeFullfillment(
      context.contract,
      foundOffer.offerEvent.to,
      _fulfillment
    );
    var lll = await data.wait();
    let toAddress = Buffer.from(
      foundOffer.offerDetailsInJson.bitcoinAddress.substring(2),
      "hex"
    );
    let hashAdress = generateTrustlexAddress(toAddress, "10");
    setTo(`${hashAdress}`);
    setInitatedata(data);
  };

  useEffect(() => {
    if (!foundOffer || foundOffer === undefined) return;

    let toAddress = Buffer.from(
      foundOffer.offerDetailsInJson.bitcoinAddress.substring(2),
      "hex"
    );
    let hashAdress = generateTrustlexAddress(toAddress, "10");
    setTo(`${hashAdress}`);
    let planningToSell_ = Number(
      ethers.utils.formatEther(foundOffer.offerDetailsInJson.offerQuantity)
    ); //offerQuantity

    setPlanningToSell(planningToSell_);

    setEthValue(planningToSell_);
  }, [foundOffer?.offerEvent?.to?.toString()]);

  // useEffect(() => {
  //   if (!listenedOfferData || listenedOfferData === undefined) return;
  //   initiateFullFillMent();
  // }, [listenedOfferData]);

  if (!isOpened) return null;
  let BTCAmount = Number(
    (
      (ethValue / data[1].props.children[0]) *
      data[2].props.children[0]
    ).toFixed(3)
  );

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
              <Text component="h1" className={styles.title}>
                <span className={styles.buy}>Buy:</span>
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
                <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.ETH)} />
                <span className={styles.for}>with</span>
                <CurrencyDisplay
                  amount={Number(
                    (
                      (ethValue / data[1].props.children[0]) *
                      data[2].props.children[0]
                    ).toFixed(3)
                  )}
                  type={CurrencyEnum.BTC}
                />{" "}
              </Text>
            </Grid.Col>
          </Grid>

          <div className={styles.stepsConatiner}>
            <div className={styles.step}>
              <div className={styles.stepTitle}>
                <div className={styles.svg}>
                  {activeStep === 1 ? <StepFilledSvg /> : <StepSvg />}
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
                            isInitiatng === "loading" ? "unset" : "transparent",
                        }}
                        loading={isInitiatng === "loading" ? true : false}
                        onClick={handleInitate}
                      >
                        {isInitiatng === "loading" ? "Initiating" : "Initiate"}
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

            <div className={styles.step}>
              <div className={styles.stepTitle}>
                <div className={styles.svg}>
                  {activeStep === 2 ? <StepFilledSvg /> : <StepSvg />}
                </div>
                <h2 className={styles.stepCount}>Step 2</h2>
                {/* <img src="https://chart.googleapis.com/chart?chs=225x225&chld=L|2&cht=qr&chl=bitcoin:1MoLoCh1srp6jjQgPmwSf5Be5PU98NJHgx?amount=.01%26label=Moloch.net%26message=Donation" /> */}
              </div>
              <div className={styles.stepsContentsContainer}>
                <div className={styles.stepContent}>
                  <div className={styles.spacing} />
                  <div className={styles.sendToContainer}>
                    {
                      <div className={styles.qrImage}>
                        {/* values can be set anything but should a string */}
                        {/* Can use JSON.stringify(value) to make string of any values like arrays */}
                        {/* Can use JSON.parse(value) to parse the value in arrays */}
                        <QRCodeCanvas
                          value={initatedata ? initatedata.to : "Random value"}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                          // bgColor="#7C7C7C00"
                          // fgColor="#7C7C7C"
                        />
                      </div>
                    }
                    <img
                      src={`https://chart.googleapis.com/chart?chs=225x225&chld=L|2&cht=qr&chl=bitcoin:${to}?amount=${BTCAmount}%26label=Trustlex%26message=Buying_Ether`}
                      className={styles.qrImage}
                    />
                    <div className={styles.sendTo}>
                      <span>
                        Send &nbsp;
                        <CurrencyDisplay
                          amount={BTCAmount}
                          type={CurrencyEnum.BTC}
                        />{" "}
                        Bitcoins to:
                      </span>
                      {mobileView ? <span>{to}</span> : <span>{to}</span>}
                    </div>
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
                  {activeStep === 3 ? <StepFilledSvg /> : <StepSvg />}
                </div>
                <h2 className={styles.stepCount}>Step 3</h2>
              </div>
              <div className={styles.stepsContentsContainer}>
                <div className={`${styles.stepContent} ${styles.lastContent}`}>
                  <div className={styles.spacing} />
                  <div className={styles.submitProof}>
                    <h3>Submit Proof</h3>
                    <p>
                      Submit Proof of payment before 01 January, 2023 23:45 or
                      add more collateral to increase payment confirmation time
                      in order to have the ability to withdraw ETH from smart
                      contract
                    </p>
                  </div>
                  <div className={styles.spacing} />
                  <div
                    className={`${styles.stepItem} ${styles.proofCheckbox} ${
                      verified && styles.activeStepItem
                    }`}
                    onClick={() => setVerified(!verified)}
                  >
                    <div className={styles.checkboxContainer}>
                      <input
                        type="radio"
                        className={styles.checkbox}
                        checked={verified}
                        onChange={() => {
                          setVerified(true);
                        }}
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
                            <span>trustlex.so/5aa2342esd2...</span>
                            <div className={styles.iconBox}>
                              <Icon
                                icon={"tabler:copy"}
                                className={styles.icon}
                              />
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
