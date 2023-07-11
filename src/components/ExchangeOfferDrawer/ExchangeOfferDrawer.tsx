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
import { tofixedEther, EthtoWei } from "~/utils/Ether.utills";
import { AppContext } from "~/Context/AppContext";
// import { TextInput, TextInputProps } from "@mantine/core";
import Input from "../Input/Input";
// import { BitcoinMerkleTree } from "bitcoin-merkle-tree/dist/index";
import { BitcoinMerkleTree, MerkleProof } from "~/utils/bitcoinmerkletree";
import { IBitcoinPaymentProof } from "~/interfaces/IBitcoinNode";
import {
  IFullfillmentEvent,
  IFullfillmentResult,
  IOfferdata,
} from "~/interfaces/IOfferdata";
import {
  InitializeFullfillment,
  showSuccessMessage,
  showErrorMessage,
  getOffer,
  submitPaymentProof,
  getInitializedFulfillmentsByOfferId,
  getInitializedFulfillments,
  increaseContractAllownace,
} from "~/service/AppService";
import {
  GetTransactionDetails,
  VerifyTransaction,
  GetBlock,
} from "~/service/BitcoinService";
import { QRCodeCanvas } from "qrcode.react";
import { address } from "bitcoinjs-lib";
import { generateTrustlexAddress, tofixedBTC } from "~/utils/BitcoinUtils";
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
import { DEFAULT_COLLETARAL_FEES } from "~/Context/Constants";

import {
  IconAdjustments,
  IconClipboardCopy,
  IconClipboardCheck,
  IconCopy,
} from "@tabler/icons-react";
import { Tooltip } from "@mantine/core";
import { default as Countdowntimer } from "react-countdown";
import BtcToSatoshiConverter from "~/utils/BtcToSatoshiConverter";
import { currencyObjects } from "~/Context/Constants";

type Props = {
  isOpened: boolean;
  onClose: (clickedOnInitiateButton: boolean) => void;
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
  fullFillmentPaymentProofSubmitted: boolean | undefined;
  setFullFillmentPaymentProofSubmitted: (
    fullFillmentPaymentProofSubmitted: boolean | undefined
  ) => void;
  selectedToken: string;
  selectedNetwork: string;
  refreshMySwapOngoingListKey: number;
  setRefreshMySwapOngoingListKey: (refreshMySwapOngoingListKey: number) => void;
  refreshMySwapCompletedListKey: number;
  setRefreshMySwapCompletedListKey: (
    refreshMySwapCompletedListKey: number
  ) => void;
  selectedBitcoinNode: string;
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
  fullFillmentPaymentProofSubmitted,
  setFullFillmentPaymentProofSubmitted,
  selectedToken,
  selectedNetwork,
  refreshMySwapOngoingListKey,
  setRefreshMySwapOngoingListKey,
  refreshMySwapCompletedListKey,
  setRefreshMySwapCompletedListKey,
  selectedBitcoinNode,
}: Props) => {
  const { cleanTx } = window;
  const { mobileView } = useWindowDimensions();
  const rootRef = useRef(null);
  const context = useContext(AppContext);
  const [ethValue, setEthValue] = useState<number | string>(0);

  const [checked, setChecked] = useState("allow");
  const [activeStep, setActiveStep] = useState(1);
  const [verified, setVerified] = useState("");
  // const [verified, setIsTxVerify] = useState("");
  const [blockHash, setBlockHash] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const [confirmed, setConfirmed] = useState("");
  const [initatedata, setInitatedata]: any = useState([]);
  const [to, setTo] = useState("");
  const [planningToSell, setPlanningToSell] = useState(0);
  const [leftToBuy, setLeftToBuy] = useState(0);
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
  const [clickedOnInitiateButton, setClickedOnInitiateButton] =
    useState<boolean>(false);
  const [isColletaralNeeded, setIsColletaralNeeded] = useState<boolean>(false);
  const { scrollDirection } = useDetectScrollUpDown();
  // console.log(selectedNetwork, selectedToken);
  let selectedCurrencyIcon =
    currencyObjects[selectedNetwork][selectedToken.toLowerCase()]?.icon;
  const [bitcoinPaymentProof, setBitcoinPaymentProof] =
    useState<IBitcoinPaymentProof>({
      transaction: "",
      proof: "",
      index: 0,
      blockHeight: 0,
    });
  useEffect(() => {
    if (rowOfferId === null) {
      onClose(false);
    }
  }, [rowOfferId]);

  if (context === null) {
    return <>Loading...</>;
  }

  const { listenedOfferData, listenedOfferDataByNonEvent } = context;

  let foundOffer =
    rowOfferId &&
    // listenedOfferData.offers.find((offer) => {
    listenedOfferDataByNonEvent.offers.find((offer) => {
      // return offer.offerDetailsInJson.offerId === data[0];
      return Number(offer.offerDetailsInJson.offerId) === Number(rowOfferId);
    });

  // console.log(foundOffer, data, listenedOfferData, listenedOfferDataByNonEvent);
  useAutoHideScrollbar(rootRef);
  useEffect(() => {
    (async () => {
      if (!rowOfferId || rowOfferId === undefined) return;

      // get offer details
      let offerDetails: IOfferdata | false | undefined = await getOffer(
        contract,
        rowOfferId
      );
      if (!offerDetails || offerDetails === undefined) return;
      // console.log(offerDetails);
      // get the offerfullfillment details
      let fullfillmentResults = await getInitializedFulfillmentsByOfferId(
        contract,
        rowOfferId
      );
      // console.log(fullfillmentResults);
      if (!foundOffer || foundOffer === undefined) return;

      let countdowntimerTime_ = rowFullFillmentExpiryTime
        ? parseInt(rowFullFillmentExpiryTime) * 1000
        : 0;
      setCountdowntimerTime(countdowntimerTime_);
      setCountDownTimeColor(findOrderExpireColor(countdowntimerTime_));
      setCountdowntimerTimeKey(countdowntimerKey + 1);

      //check order is expired or not

      let isOrderExpired = false;
      if (rowFullFillmentExpiryTime && countdowntimerTime_ < Date.now()) {
        isOrderExpired = true;
        setIsOrderExpired(true);
      }

      let planningToSell_ = Number(
        ethers.utils.formatEther(foundOffer.offerDetailsInJson.offerQuantity)
      ); //offerQuantity
      let offer = foundOffer;

      const price_per_ETH_in_BTC =
        Number(
          SatoshiToBtcConverter(offer.offerDetailsInJson.satoshisToReceive)
        ) /
        Number(
          ethers.utils.formatEther(offer.offerDetailsInJson.offerQuantity)
        );
      // const satoshisToReceive = Number(
      //   offer.offerDetailsInJson.satoshisToReceive
      // );
      // let satoshisReserved = Number(offer.offerDetailsInJson.satoshisReserved);

      // const satoshisReceived = Number(
      //   offer.offerDetailsInJson.satoshisReceived
      // );
      // console.log(offerDetails);
      let satoshisToReceive = Number(offerDetails.satoshisToReceive);
      let satoshisReserved = Number(offerDetails.satoshisReserved);

      let satoshisReceived = Number(offerDetails.satoshisReceived);
      const offerQuantity = Number(offerDetails.offerQuantity);
      fullfillmentResults &&
        fullfillmentResults?.map(
          (value: IFullfillmentResult, index: number) => {
            let expiryTime = Number(value.fulfillmentRequest.expiryTime) * 1000;
            let isExpired = value.fulfillmentRequest.isExpired;
            let paymentProofSubmitted =
              value.fulfillmentRequest.paymentProofSubmitted;
            if (
              expiryTime < Date.now() &&
              isExpired == false &&
              paymentProofSubmitted == false
            ) {
              satoshisReserved -= Number(
                value.fulfillmentRequest.quantityRequested
              );
            }
          }
        );

      // console.log(satoshisReserved);
      let left_to_buy =
        Number(
          SatoshiToBtcConverter(
            satoshisToReceive - (satoshisReserved + satoshisReceived)
          )
        ) / price_per_ETH_in_BTC;

      setPlanningToBuy(
        Number(tofixedBTC(Number(SatoshiToBtcConverter(satoshisToReceive))))
      );

      setIsInitating("");
      setTo("");
      setActiveStep(1);
      setVerified("");
      setConfirmed("");

      setPlanningToSell(planningToSell_);
      // setEthValue(planningToSell_);
      //if order already initiated
      let isInitating = false;
      if (
        rowFullFillmentId != undefined &&
        isOrderExpired == false &&
        fullFillmentPaymentProofSubmitted == false
      ) {
        isInitating = true;
        setIsInitating("initiated");
        let toAddress = Buffer.from(
          foundOffer.offerDetailsInJson.bitcoinAddress.substring(2),
          "hex"
        );
        let pubKeyHash = toAddress;
        console.log(foundOffer.offerDetailsInJson.bitcoinAddress);
        let fulfillmentId = rowFullFillmentId;
        setOfferFulfillmentId(fulfillmentId);
        if (fulfillmentId.length % 2 != 0) {
          fulfillmentId = "0" + fulfillmentId;
        }
        let contractAddress =
          currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
            ?.orderBookContractAddreess;
        let orderTimestamp = foundOffer.offerDetailsInJson.orderedTime;
        console.log(orderTimestamp);
        const orderId = ethers.utils.keccak256(
          ethers.utils.solidityPack(
            ["address", "uint256", "uint256", "bytes20", "uint256"],
            // To be interpreted as: address of contract, orderId, fulfillmentId, pubKeyHash, orderTimestamp
            // ["0xFD05beBFEa081f6902bf9ec57DCb50b40BA02510", 0, 0, '0x0000000000000000000000000000000000000000', 0]
            [
              contractAddress,
              rowOfferId,
              rowFullFillmentId,
              foundOffer.offerDetailsInJson.bitcoinAddress,
              orderTimestamp,
            ]
          )
        );

        const shortOrderId = orderId.slice(2, 10);
        console.log(shortOrderId, orderId);
        // let hashAdress = generateTrustlexAddress(toAddress, fulfillmentId);
        let hashAdress = generateTrustlexAddress(pubKeyHash, shortOrderId);
        setTo(`${hashAdress}`);
        setActiveStep(2);
        // console.log(rowFullFillmentQuantityRequested);
        left_to_buy =
          Number(
            SatoshiToBtcConverter(rowFullFillmentQuantityRequested as string)
          ) *
          (Number(ethers.utils.formatEther(offerQuantity)) /
            Number(SatoshiToBtcConverter(satoshisToReceive)));
      }
      left_to_buy = tofixedEther(left_to_buy);
      // console.log(left_to_buy);
      setLeftToBuy(left_to_buy);
      setEthValue(left_to_buy);

      // update satoshisReserved amount
      // if (satoshisToReceive == satoshisReserved + satoshisReceived) {
      // let fullfillmentResults = offer.offerDetailsInJson.fullfillmentResults;
      let isColletaralNeeded = false;

      // }
      if (satoshisReserved > 0 && isInitating == false) {
        setIsColletaralNeeded(true);
      }
    })();
  }, [foundOffer?.offerDetailsInJson?.offerId]);

  const handleInitate = async () => {
    // validate the eth value
    let buyAmount: number = ethValue as number;

    if (buyAmount <= 0) {
      showErrorMessage("Please enter buy amount greater than 0 !");
      return false;
    } else if (buyAmount > leftToBuy) {
      showErrorMessage(
        `Buy amount can not be greater that offer quanity ${leftToBuy} !`
      );
      return false;
    }
    let btcAmount = getBTCAmount();
    if (btcAmount == 0) {
      showErrorMessage("BTC Amount should not be zero.");
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
    // fisrt get the offer details
    let offerDetails = await getOffer(
      context.contract,
      foundOffer.offerDetailsInJson.offerId
    );
    let totalCollateralAdded =
      foundOffer.offerDetailsInJson.collateralPer3Hours;
    let colletarealValue = "0";

    if (isColletaralNeeded == true) {
      colletarealValue = getColletaralValue().toString();
      totalCollateralAdded = EthtoWei(colletarealValue).toString();
      // if (selectedToken != "ETH") {
      //   let tokenAmount = colletarealValue;
      //   // Allow the contract to get the token
      //   let allownaceResult = await increaseContractAllownace(
      //     selectedToken,
      //     tokenAmount
      //   );
      //   if (allownaceResult == false || !allownaceResult) {
      //     return false;
      //   }
      //   // console.log(allownaceResult);
      // }
    }

    const _fulfillment: IFullfillmentEvent = {
      // fulfillmentBy: foundOffer.offerEvent.from,
      fulfillmentBy: account,
      // quantityRequested: foundOffer.offerDetailsInJson.satoshisToReceive,
      quantityRequested: BtcToSatoshiConverter(getBTCAmount()),
      allowAnyoneToSubmitPaymentProofForFee: true,
      allowAnyoneToAddCollateralForFee: true,
      totalCollateralAdded: totalCollateralAdded.toString(),
      // expiryTime: foundOffer.offerDetailsInJson.offerValidTill,
      expiryTime: getTimeInSeconds().toString(),
      fulfilledTime: 0,
      // collateralAddedBy: foundOffer.offerEvent.from,
      collateralAddedBy: account,
      paymentProofSubmitted: false,
      isExpired: false,
    };

    console.log(_fulfillment);

    const data = await InitializeFullfillment(
      context.contract,
      // foundOffer.offerEvent.to,
      foundOffer.offerDetailsInJson.offerId,
      _fulfillment,
      totalCollateralAdded
    );
    if (data) {
      console.log(data);
      let events =
        data?.events &&
        data?.events?.filter((value: any) => {
          if (value?.event && value?.event == "INITIALIZED_FULFILLMENT") {
            return true;
          } else {
            return false;
          }
        });
      console.log(events);
      let event = events[0];
      // let claimedBy = event?.args["claimedBy"];
      // let offerId = event?.args["offerId"]?.toString();
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
      let pubKeyHash = toAddress;
      if (fulfillmentId.length % 2 != 0) {
        fulfillmentId = "0" + fulfillmentId;
      }
      let contractAddress =
        currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
          ?.orderBookContractAddreess;
      let orderTimestamp = foundOffer.offerDetailsInJson.orderedTime;

      const orderId = ethers.utils.keccak256(
        ethers.utils.solidityPack(
          ["address", "uint256", "uint256", "bytes20", "uint256"],
          // To be interpreted as: address of contract, orderId, fulfillmentId, pubKeyHash, orderTimestamp
          // ["0xFD05beBFEa081f6902bf9ec57DCb50b40BA02510", 0, 0, '0x0000000000000000000000000000000000000000', 0]
          [
            contractAddress,
            foundOffer.offerDetailsInJson.offerId,
            fulfillmentId,
            foundOffer.offerDetailsInJson.bitcoinAddress,
            orderTimestamp,
          ]
        )
      );

      const shortOrderId = orderId.slice(2, 10);
      // console.log(shortOrderId, orderId);
      // let hashAdress = generateTrustlexAddress(toAddress, fulfillmentId);
      let hashAdress = generateTrustlexAddress(pubKeyHash, shortOrderId);

      // let hashAdress = generateTrustlexAddress(toAddress, fulfillmentId);
      setTo(`${hashAdress}`);
      setInitatedata(data);
      setActiveStep(activeStep + 1);
      setrowFullFillmentExpiryTime(expiryTime);
      setCountdowntimerTime(expiryTime ? parseInt(expiryTime) * 1000 : 0);
      setCountdowntimerTimeKey(countdowntimerKey + 1);
      setIsOrderExpired(false);
      setFullFillmentPaymentProofSubmitted(false);
      // setRefreshOffersListKey(refreshOffersListKey + 1);
      setClickedOnInitiateButton(true);
      setRefreshMySwapOngoingListKey(refreshMySwapOngoingListKey + 1);
      setRefreshMySwapCompletedListKey(refreshMySwapCompletedListKey + 1);
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
    // fetching the first fullfillment details
    // get the Fulfillments By OfferId
    let fullfillmentEvent: IFullfillmentEvent =
      await getInitializedFulfillments(
        contract,
        offerId,
        Number(offerFulfillmentId)
      );
    // console.log(fullfillmentEvent);
    let expiryTime = Number(fullfillmentEvent.expiryTime) * 1000;
    // console.log(expiryTime, Date.now(), expiryTime < Date.now());
    if (expiryTime < Date.now()) {
      showErrorMessage("Order has been expired !");
      setConfirmed("");
      return false;
    }
    if (bitcoinPaymentProof.index == 0) {
      showErrorMessage("Please very the transansaction again");
      setConfirmed("");
      return false;
    }

    let result = await submitPaymentProof(
      contract,
      offerId,
      offerFulfillmentId.toString(),
      bitcoinPaymentProof
    );
    console.log(bitcoinPaymentProof, result);
    if (result) {
      setSubmitPaymentProofTxHash(result.transactionHash);
      setConfirmed("confirmed");
      showSuccessMessage("Proof has been submitted successfully !");
      setActiveStep(4);
      setTimeout(function () {
        setRefreshOffersListKey(refreshOffersListKey + 1);
        onClose(false);
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
    let inputAmount = Number(ethValue);
    let BTCAmount = tofixedBTC((inputAmount / planningToSell) * planningToBuy);
    // console.log(inputAmount, planningToSell, planningToBuy, BTCAmount);
    return BTCAmount;
  };

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
      // Render a countdown
      return <span>{days}d:{hours}h {minutes}m:{seconds}s <br/></span>;
  }

  const getColletaralValue = () => {
    let inputAmount = Number(ethValue);
    let colletaralValue = tofixedEther(
      (inputAmount * DEFAULT_COLLETARAL_FEES) / 100
    );
    return colletaralValue;
  };
  const handleTxVerification = async () => {
    if (blockHash == "") {
      showErrorMessage("Please enter the block hash");
      return;
    }
    if (transactionHash == "") {
      showErrorMessage("Please enter the transaction hash");
      return;
    }
    setVerified("verifing");
    // first verify the blockhash
    let blockResult: any = await GetBlock(selectedBitcoinNode, blockHash);
    if (blockResult.status == false) {
      showErrorMessage(blockResult.message);
      setVerified("");
      return false;
    }
    let blockTxs = blockResult.result.tx;
    let blockHeight = blockResult.result.height;

    // console.log(blockTxs, blockHeight);
    // now validate the transaction
    let recieverAddress = to;
    let paymentAmount = getBTCAmount();
    let result: any = await VerifyTransaction(
      selectedBitcoinNode,
      transactionHash,
      recieverAddress,
      paymentAmount
    );
    if (result.status == false) {
      showErrorMessage(result.message);
      setVerified("");
      return false;
    } else {
      setVerified("verified");
      setActiveStep(activeStep + 1);
      let rawTransaction = result.result;
      const cleanedTx = cleanTx(rawTransaction);

      const bitcoinMerkleTreeInstance = new BitcoinMerkleTree(blockTxs);
      const proofResult: MerkleProof | boolean | null =
        bitcoinMerkleTreeInstance.getInclusionProof(transactionHash);
      if (proofResult == null || (proofResult as unknown) == false) {
        return false;
      }
      let proof = proofResult.hashes;
      proof.shift(); // skip 0 index element
      const proof_bytes = proof
        .map((hash) => {
          return Buffer.from(hash, "hex").reverse().toString("hex");
        })
        .join("");
      console.log(proofResult);

      console.log(proofResult, proof);

      // create the submit payment proof
      setBitcoinPaymentProof({
        ...bitcoinPaymentProof,
        transaction: "0x" + cleanedTx,
        blockHeight: blockHeight,
        index: proofResult.index,
        proof: "0x" + proof_bytes,
      });
    }
  };

  return (
    <Drawer
      opened={isOpened}
      onClose={() => {
        onClose(clickedOnInitiateButton);
      }}
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
                <span
                  className={styles.cancel}
                  onClick={() => {
                    onClose(false);
                  }}
                >
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
                <Button
                  variant={VariantsEnum.default}
                  onClick={() => {
                    onClose(false);
                  }}
                  p={0}
                >
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
                            setEthValue(tofixedEther(Number(value)));
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
                  {selectedCurrencyIcon}
                  {/* <ImageIcon
                    image={getIconFromCurrencyType(CurrencyEnum.ETH)}
                  /> */}
                  <span className={styles.for}>with</span>
                  <CurrencyDisplay
                    amount={getBTCAmount()}
                    type={CurrencyEnum.BTC}
                  />{" "}
                </Text>
                {/* Time Left Countdown timer Start Here */}
                <div
                  style={{
                    display: "inline-block",
                    verticalAlign: "text-top",
                    margin: "0 auto",
                    float: "right",
                  }}
                >
                  {rowFullFillmentExpiryTime &&
                  isOrderExpired == false &&
                  fullFillmentPaymentProofSubmitted == false ? (
                    <>
                      <span style={{fontSize: "8"}}>Time Left</span>&nbsp;
                      <span style={{ borderBlockColor: "green", color: countDownTimeColor }}>
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
                          renderer={renderer}
                          key={countdowntimerKey}
                        />
                      </span>
                      <small>(For submiiting the payment proof)</small>
                    </>
                  ) : (
                    ""
                  )}
                </div>
                {/* Time Left Countdown timer End Here */}
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
                  {/* Colloerateral section start here */}
                  {isColletaralNeeded == true ? (
                    <>
                      <div className={styles.colletaralTextContainer}>
                        <span
                          className={styles.colletaralText}
                        >{`Colletaral (optional)`}</span>
                        <span className={styles.colletaralText}>
                          There is already one offer fullfillment in progress.
                          Post {getColletaralValue()} {DEFAULT_COLLETARAL_FEES}%{" "}
                          <ImageIcon
                            image={getIconFromCurrencyType(CurrencyEnum.ETH)}
                          />
                          collateral to increase the payment confirmation time
                          by 3 more hours
                        </span>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {/* <div className={styles.actionButton}>
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
                  </div> */}
                  {/* Colloerateral section end here */}
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
                          onClick={
                            isColletaralNeeded == true
                              ? handleInitate
                              : handleInitate
                          }
                        >
                          {isInitiatng === "loading" ? (
                            "Initiating"
                          ) : (
                            <>
                              Initiate{" "}
                              {isColletaralNeeded == true
                                ? "with Colletaral"
                                : ""}
                            </>
                          )}
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
                          {/* Input the transaction hash */}
                          {/* <TextInput
                            type={"text"}
                            placeholder={"Enter the transaction hash"}
                            label={"Transaction Hash"}
                            value={""}
                            className="TxHashInput"
                          /> */}
                          <Input
                            type={"text"}
                            placeholder={"Enter the Block Hash"}
                            value={blockHash}
                            onChange={(e) => {
                              setBlockHash(e.target.value);
                            }}
                            className="BlockHashInput"
                          />
                          <Input
                            type={"text"}
                            placeholder={"Enter the Transaction Hash"}
                            value={transactionHash}
                            onChange={(e) => {
                              setTransactionHash(e.target.value);
                            }}
                            className="TxHashInput"
                          />
                          <div className={styles.actionButton}>
                            {verified === "verified" ? (
                              <Button
                                variant={VariantsEnum.outline}
                                radius={10}
                                style={{
                                  borderColor: "#53C07F",
                                  background: "unset",
                                  color: "#53C07F",
                                }}
                                leftIcon={
                                  <Icon
                                    icon={"charm:circle-tick"}
                                    color="#53C07F"
                                  />
                                }
                              >
                                Verified
                              </Button>
                            ) : (
                              <Button
                                variant={
                                  verified === "verifing"
                                    ? VariantsEnum.outline
                                    : VariantsEnum.outlinePrimary
                                }
                                radius={10}
                                style={{
                                  backgroundColor:
                                    verified === "verifing"
                                      ? "unset"
                                      : "transparent",
                                }}
                                loading={verified === "verifing" ? true : false}
                                onClick={handleTxVerification}
                              >
                                {verified === "verifing" ? (
                                  "Verifing"
                                ) : (
                                  <>Verify </>
                                )}
                              </Button>
                            )}
                            {verified === "verifing" ? (
                              <span className={styles.timer}>
                                <Countdown />
                              </span>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </>
                    )}
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
                      time in order to have the ability to withdraw {selectedToken} from
                      smart contract
                    </p>
                  </div>
                  <div className={styles.spacing} />
                  <div
                    className={`${styles.stepItem} ${styles.proofCheckbox} ${
                      verified == "verified" && styles.activeStepItem
                    }`}
                    onClick={() => {
                      // setVerified(!verified);
                      // if (verified == false && activeStep == 2) {
                      //   setActiveStep(activeStep + 1);
                      //   setVerified(true);
                      // } else if (verified == true && activeStep == 3) {
                      //   setActiveStep(activeStep - 1);
                      //   setVerified(false);
                      // }
                    }}
                  >
                    <div className={styles.checkboxContainer}>
                      <input
                        type="radio"
                        className={styles.checkbox}
                        checked={verified == "verified" ? true : false}
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
                          confirmed !== "loading" && verified === "verified"
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
