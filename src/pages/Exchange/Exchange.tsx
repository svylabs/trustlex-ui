import { Center } from "@mantine/core";
import { Icon } from "@iconify/react";
import React, { ReactNode, useEffect, useState } from "react";
import ActionButton from "~/components/ActionButton/ActionButton";
import Button from "~/components/Button/Button";
import ExchangeSwapGroup from "~/components/ExchangeSwapGroup/ExchangeSwapGroup";
import GradientBackgroundContainer from "~/components/GradientBackgroundContainer/GradientBackgroundContainer";
import ImageIcon from "~/components/ImageIcon/ImageIcon";
import Input from "~/components/Input/Input";
import { InputWithSelect } from "~/components/InputWithSelect/InputWithSelect";
import Select from "~/components/Select/Select";
import SpanFullGridWidth from "~/components/SpanFullGridWidth/SpanFullGridWidth";
import Table from "~/components/Table/Table";
import {
  data2,
  exchangeMobileTableCols,
  exchangeTableCols,
  minCollateral,
  offerValidity,
} from "~/data/exchangePage";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import { VariantsEnum } from "~/enums/VariantsEnum";
import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";
import { EthtoWei, WeitoEth } from "~/utils/Ether.utills";
import styles from "./Exchange.module.scss";
import SeeMoreButton from "~/components/SeeMoreButton/SeeMoreButton";
import ExchangeOfferDrawer from "~/components/ExchangeOfferDrawer/ExchangeOfferDrawer";
import getTableData from "~/components/ExchangePrepareTableData/GetTableData";
import { AppContext } from "~/Context/AppContext";

import { BitcoinMerkleTree } from "~/utils/bitcoinmerkletree";

import {
  GetTransactionDetails,
  GetRawTransaction,
  VerifyTransaction,
  GetBlock,
} from "~/service/BitcoinService";
import {
  AddOfferWithEth,
  InitializeFullfillment,
  connect,
  getOffers,
  listOffers,
  getTotalOffers,
  getOffersList,
  showErrorMessage,
  showSuccessMessage,
  addOfferWithToken,
  getOffer,
  getInitializedFulfillmentsByOfferId,
} from "~/service/AppService";
import BtcToSatoshiConverter from "~/utils/BtcToSatoshiConverter";
import { IListenedOfferData } from "~/interfaces/IOfferdata";
import { PaperWalletDownloadedEnum } from "~/interfaces/IExchannge";
import SatoshiToBtcConverter from "~/utils/SatoshiToBtcConverter";
import {
  NumberToTime,
  TimeToNumber,
  TimeToDateFormat,
} from "~/utils/TimeConverter";
import { ethers } from "ethers";
import {
  Wallet,
  generateBitcoinWallet,
  generateTrustlexAddress,
} from "~/utils/BitcoinUtils";

import { showNewTransactions } from "~/utils/BitcoinRPCJS";

import GenerateWalletDrawer from "~/components/GenerateWalletDrawer/GenerateWalletDrawer";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
import MainLayout from "~/components/MainLayout/MainLayout";
import {
  MAX_BLOCKS_TO_QUERY,
  MAX_ITERATIONS,
  PAGE_SIZE,
  ERC20TokenKey,
  currencyObjects,
} from "~/Context/Constants";
import { IFullfillmentResult } from "~/interfaces/IOfferdata";

type Props = {};

const mobileTableDummyData: string[][] = new Array(5).fill([
  1211,

  "09 Jan, 13:45pm",
  <SeeMoreButton
    onClick={(e) => {
      // console.log("button clicked");
    }}
  />,
]);

const Exchange = (props: Props) => {
  const [rowData, setRowData] = useState<(string | ReactNode)[] | null>(null);
  const [rowOfferId, setRowOfferId] = useState<number | null>(null);
  const [rowFullFillmentId, setRowFullFillmentId] = useState<
    string | undefined
  >();

  const [generateAddress, setGenerateAddress] = useState("");

  const [confirm, setConfirm] = useState("none");

  const [addOffer, setAddOffer] = useState(false);
  const [showAddOfferButton, setShowAddOfferButton] = useState(true);

  const [paperWalletDownloaded, setPaperWalletDownloaded] =
    useState<PaperWalletDownloadedEnum>(PaperWalletDownloadedEnum.NotGenerated);
  const [rowFullFillmentExpiryTime, setrowFullFillmentExpiryTime] = useState<
    string | undefined
  >();
  const [
    fullFillmentPaymentProofSubmitted,
    setFullFillmentPaymentProofSubmitted,
  ] = useState<boolean | undefined>();
  const [
    rowFullFillmentQuantityRequested,
    setRowFullFillmentQuantityRequested,
  ] = useState<string | undefined>();
  const [exchangeOfferDrawerKey, setExchangeOfferDrawerKey] =
    useState<number>(0);
  const context = React.useContext(AppContext);
  if (context === null) {
    return <>Loading...</>;
  }

  const {
    listenedOfferData,
    setListenedOfferData,
    userInputData,
    setUserInputData,
    listenedOfferDataByNonEvent,
    setListenedOfferDataByNonEvent,
    isMoreTableDataLoading,
    setMoreTableDataLoading,
    exchangeLoadingText,
    setExchangeLoadingText,
    totalOffers,
    setTotalOffers,
    fromOfferId,
    setFromOfferId,
    refreshOffersListKey,
    setRefreshOffersListKey,
    account,
    contract,
    selectedToken,
    selectedNetwork,
    refreshMySwapOngoingListKey,
    setRefreshMySwapOngoingListKey,
    refreshMySwapCompletedListKey,
    setRefreshMySwapCompletedListKey,
    selectedBitcoinNode,
    btcWalletData,
    setBTCWalletData,
    getSelectedTokenContractInstance,
  } = context;

  const [exchangeData, setExchangeData] = useState({
    address: "",
    pubkeyHash: "",
    valid:
      typeof offerValidity[0] === "string"
        ? offerValidity[0]
        : offerValidity[0].value,
    collateral:
      typeof minCollateral[0] === "string"
        ? minCollateral[0]
        : minCollateral[0].value,
  });

  const mobileData = listenedOfferData.offers.map(
    (offer: IListenedOfferData) => {
      return [
        offer.offerDetailsInJson.offeredBlockNumber,
        "09 Jan, 13:45pm",
        <SeeMoreButton onClick={(e) => {}} />,
      ];
    }
  );

  const [mobileTableData, setMobileTableData] =
    useState<(string | JSX.Element)[][]>(mobileData);

  // let data = getTableData(listenedOfferData.offers);
  // console.log("data", data);

  const [generatedBitcoinData, setGeneratedBitcoinData] =
    useState<Wallet | null>(null);
  // const [tableData, setTableData] = useState<(string | JSX.Element)[][]>(data);
  const [tableData, setTableData] = useState<(string | JSX.Element)[][]>([]);
  const [generateWalletDrawerOpen, setGenerateWalletDrawerOpen] =
    useState(false);

  const loadMoreOffersByNonEvent = async () => {
    setMoreTableDataLoading(true);

    callOffersListService().then((offers) => {
      const listenedOffersByNonEvent = {
        offers: [...listenedOfferDataByNonEvent.offers, ...offers.offers],
      };
      setListenedOfferDataByNonEvent(listenedOffersByNonEvent);
      setTableData(
        getTableData(
          listenedOffersByNonEvent.offers,
          selectedToken,
          selectedNetwork
        )
      );
      setMoreTableDataLoading(false);

      let fromOfferId_ =
        fromOfferId - PAGE_SIZE > 0 ? fromOfferId - PAGE_SIZE : 0;
      setFromOfferId(fromOfferId_);
      console.log(listenedOffersByNonEvent);
    });
  };

  const showLoadMoreButton = () => {
    if (fromOfferId > 0 && exchangeLoadingText == "") {
      return true;
    } else {
      return false;
    }
  };

  const callOffersListService = async () => {
    const offersList = await getOffersList(context.contract, fromOfferId);
    // console.log(offersList);
    return offersList;
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setExchangeData((prev) => {
      return { ...prev, address: e.target.value };
    });

  const handleOfferChange = (value: string) =>
    setExchangeData((prev) => {
      return { ...prev, valid: value || "" };
    });

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserInputData((prev) => {
      return { ...prev, limit: e.target.value };
    });

  const handleCollateralChange = (value: string) =>
    setExchangeData((prev) => {
      return { ...prev, collateral: value || "" };
    });

  const [hashedOfferData, setHashedOfferData] = useState("");

  // This function is triggered when click on add offer confirm button
  const handleOfferConfirm = async () => {
    try {
      // let pubkeyHash = generatedBitcoinData?.pubkeyHash.toString("hex");
      let pubkeyHash = exchangeData?.pubkeyHash;
      if (pubkeyHash === undefined) {
        showErrorMessage(
          "Address to receive Bitcoin is empty. Please click on Generate in Browser button."
        );
        return false;
      }

      setConfirm("loading");

      let inputEther: string = userInputData.activeExchange[1].value;

      let addedOffer;
      let sellCurrecny = userInputData?.activeExchange[1]?.currency;
      let isNativeToken = userInputData?.activeExchange[1].isNativeToken;

      if (isNativeToken == true) {
        const data = {
          weieth: EthtoWei(inputEther),
          satoshis: BtcToSatoshiConverter(
            userInputData.activeExchange[0].value
          ),
          pubKeyHash: pubkeyHash,
          offerValidTill: TimeToNumber(exchangeData.valid),
          account: account,
        };

        addedOffer = await AddOfferWithEth(
          context.contract,
          data,
          sellCurrecny
        );
      } else {
        let decimalPlace = Number(
          currencyObjects[selectedNetwork][sellCurrecny.toLowerCase()]
            .decimalPlace
        );

        const data = {
          tokens: (Number(inputEther) * 10 ** decimalPlace).toString(),
          satoshis: BtcToSatoshiConverter(
            userInputData.activeExchange[0].value
          ),
          bitcoinAddress: bitcoinAddress,
          offerValidTill: TimeToNumber(exchangeData.valid),
          account: account,
        };

        addedOffer = await addOfferWithToken(
          data,
          sellCurrecny,
          inputEther,
          selectedNetwork
        );
      }

      let addedOfferHash = addedOffer?.hash;

      if (addedOfferHash !== "" && addedOffer !== false) {
        setHashedOfferData(addedOffer.hash);
        setConfirm("confirmed");
        setTimeout(() => {
          setConfirm("none");
          setAddOffer(false);

          setRefreshOffersListKey(refreshOffersListKey + 1);
        }, 3000);
      } else {
        setConfirm("none");
      }
    } catch (error) {
      setConfirm("none");
    }
  };

  useEffect(() => {
    if (listenedOfferDataByNonEvent?.offers) {
      const result = getTableData(
        listenedOfferDataByNonEvent?.offers,
        selectedToken,
        selectedNetwork
      );
      setTableData(result);
    }
  }, [listenedOfferDataByNonEvent]);

  // This use effect is used if any user reset the wallet from header option
  useEffect(() => {
    if (generatedBitcoinData == null) {
      let address =
        btcWalletData !== undefined
          ? generateTrustlexAddress(
              Buffer.from(btcWalletData.pubkeyHash, "hex"),
              "10"
            )
          : "";
      let pubkeyHash =
        btcWalletData !== undefined ? btcWalletData.pubkeyHash : "";
      setExchangeData((prev) => {
        return {
          ...prev,
          address: address,
          pubkeyHash: pubkeyHash,
        };
      });
    }
  }, [btcWalletData]);

  const handleGenerateBitcoinWallet = async () => {
    const data = generateBitcoinWallet();
    // console.log(data, data.privateKey.toString("hex"));
    setGeneratedBitcoinData(data);
    setPaperWalletDownloaded(PaperWalletDownloadedEnum.Generated);
  };

  useEffect(() => {
    if (generatedBitcoinData == null) return;
    setExchangeData((prev) => {
      return {
        ...prev,
        address: generateAddress,
        pubkeyHash: generatedBitcoinData?.pubkeyHash.toString("hex"),
      };
    });
  }, [generateAddress]);

  // handleGenerateBitcoinWallet();
  const { mobileView } = useWindowDimensions();

  // const generateWalletDrawerhandleClose = () => {
  //   if (paperWalletDownloaded == PaperWalletDownloadedEnum.Generated) {
  //     showErrorMessage(
  //       "Please download the wallet first. Otherwise you will lost the payment amount! "
  //     );
  //     return false;
  //   }
  //   setGenerateWalletDrawerOpen(false);
  // };

  const handleRowClick = async (data: string[7] | ReactNode[]) => {
    if (account == "") {
      showErrorMessage("Please wait ,your account is not connected !");
      return false;
    }
    if (btcWalletData == undefined) {
      showErrorMessage("Please add the BTC wallet first");
      return false;
    }
    let offerId = data[0] as number;

    // get the Fulfillments By OfferId
    let FullfillmentResult: IFullfillmentResult[] =
      await getInitializedFulfillmentsByOfferId(contract, offerId);

    let fullfillmentResult: IFullfillmentResult | undefined =
      FullfillmentResult &&
      FullfillmentResult.find((fullfillmentResult) => {
        let isExpired = fullfillmentResult.fulfillmentRequest.isExpired;
        let paymentProofSubmitted =
          fullfillmentResult.fulfillmentRequest.paymentProofSubmitted;

        return (
          fullfillmentResult.fulfillmentRequest.fulfillmentBy.toLowerCase() ===
            account.toLowerCase() &&
          isExpired == false &&
          paymentProofSubmitted == false
        );
      });
    // console.log(
    //   "fullfillmentResult?.fulfillmentRequest",
    //   fullfillmentResult?.fulfillmentRequest
    // );
    let quantityRequested =
      fullfillmentResult?.fulfillmentRequest?.quantityRequested.toString();
    let fullFillmentPaymentProofSubmitted =
      fullfillmentResult?.fulfillmentRequest?.paymentProofSubmitted;

    setRowOfferId(offerId);
    setRowFullFillmentId(fullfillmentResult?.fulfillmentRequestId);
    setrowFullFillmentExpiryTime(
      fullfillmentResult?.fulfillmentRequest.expiryTime
    );
    setRowFullFillmentQuantityRequested(quantityRequested);
    setExchangeOfferDrawerKey(exchangeOfferDrawerKey + 1);
    setFullFillmentPaymentProofSubmitted(fullFillmentPaymentProofSubmitted);
  };

  return (
    <MainLayout title="Place your offer" description="   ">
      <div className={styles.offersTable}>
        <GradientBackgroundContainer
          colorRight="#FEBD3863"
          colorLeft="#FEBD3833"
        >
          <div className={styles.innerWrapper}>
            {addOffer && (
              <div className={styles.exchangeForm}>
                <div>
                  <div className={styles.heading}>
                    <div className={styles.caption}>All Offers</div>
                    <button onClick={() => setAddOffer(false)}>
                      Cancel
                    </button>{" "}
                  </div>
                  <div className={styles.exchangeFormContent}>
                    <div className={styles.font}>Adding offer</div>
                    <SpanFullGridWidth>
                      <ExchangeSwapGroup />
                    </SpanFullGridWidth>
                    {userInputData.activeExchange[0].currency === "btc" && (
                      <>
                        <InputWithSelect
                          options={data2}
                          type="number"
                          value={`${
                            Number(userInputData.activeExchange[0].value) /
                            Number(userInputData.activeExchange[1].value)
                          }`}
                          onChange={handleLimitChange}
                          placeholder={"Limit price BTC/ETC"}
                          disabled={true}
                        />
                        <div className={styles.temporary}></div>

                        <SpanFullGridWidth>
                          <div className={styles.addressBox}>
                            <div
                              className={styles.generateAddressButton}
                              onClick={() => {
                                handleGenerateBitcoinWallet();
                                setGenerateWalletDrawerOpen(true);
                              }}
                            >
                              <Button
                                variant={VariantsEnum.outlinePrimary}
                                radius={10}
                                style={{
                                  backgroundColor: "transparent",
                                }}
                                fullWidth={mobileView ? true : false}
                              >
                                Generate in browser
                              </Button>
                            </div>

                            <Input
                              type="text"
                              label="Address to receive Bitcoin"
                              placeholder="Click Button ->"
                              value={exchangeData.address}
                              style={{
                                width: "78%",
                              }}
                              disabled
                              onChange={handleAddressChange}
                            />
                          </div>
                        </SpanFullGridWidth>

                        <Select
                          onChange={handleOfferChange}
                          label="Offer valid for"
                          data={offerValidity}
                          value={exchangeData.valid}
                          styles={{ rightSection: { pointerEvents: "none" } }}
                        />
                        <div className={styles.temporary}></div>
                        <Select
                          label={
                            <span className={styles.collateralLabel}>
                              <ImageIcon image="/icons/info.svg" /> Minimum
                              Collateral{" "}
                            </span>
                          }
                          disabled={true}
                          onChange={handleCollateralChange}
                          value={exchangeData.collateral}
                          data={minCollateral}
                        />
                      </>
                    )}
                    {confirm !== "confirmed" ? (
                      <Button
                        radius={10}
                        fullWidth
                        style={{ height: "4.5rem" }}
                        variant={
                          confirm === "loading"
                            ? VariantsEnum.outline
                            : VariantsEnum.primary
                        }
                        loading={confirm === "loading" ? true : false}
                        onClick={handleOfferConfirm}
                      >
                        {confirm === "loading" ? "Confirming" : "Confirm"}
                      </Button>
                    ) : (
                      <div className={styles.confirmed}>
                        <Button
                          variant={VariantsEnum.outline}
                          radius={10}
                          style={{
                            borderColor: "#53C07F",
                            background: "unset",
                            color: "#53C07F",
                          }}
                          fullWidth
                          leftIcon={
                            <Icon icon={"charm:circle-tick"} color="#53C07F" />
                          }
                        >
                          Confirmed
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className={styles.tableInner}>
              <Table
                tableCaption="All offers"
                cols={exchangeTableCols}
                data={tableData}
                horizontalSpacing={"md"}
                addOffer={addOffer}
                // OfferModal={AddOfferModal}
                setOffer={setAddOffer}
                verticalSpacing={"md"}
                onRowClick={handleRowClick}
                showAddOfferButton={showAddOfferButton}
                loadingText={exchangeLoadingText}
              />
            </div>
            <div className={styles.mobileTableInner}>
              <Table
                tableCaption="All offers"
                cols={exchangeMobileTableCols}
                data={mobileTableData}
                setOffer={setAddOffer}
                // OfferModal={AddOfferModal}
                addOffer={addOffer}
                verticalSpacing={"md"}
                horizontalSpacing={"xs"}
                onRowClick={handleRowClick}
                showAddOfferButton={showAddOfferButton}
                loadingText={exchangeLoadingText}
              />
            </div>
            <br />
            <Center>
              {exchangeLoadingText != "" ? (
                <ActionButton
                  variant={"transparent"}
                  loading={isMoreTableDataLoading}
                >
                  {exchangeLoadingText}
                </ActionButton>
              ) : (
                ""
              )}
              {showLoadMoreButton() == true ? (
                <ActionButton
                  variant={"transparent"}
                  loading={isMoreTableDataLoading}
                  onClick={loadMoreOffersByNonEvent}
                >
                  Load More
                </ActionButton>
              ) : (
                ""
              )}
            </Center>
          </div>
        </GradientBackgroundContainer>
      </div>
      <ExchangeOfferDrawer
        onClose={(clickedOnInitiateButton: boolean) => {
          setRowOfferId(null);
          if (clickedOnInitiateButton == true) {
            setRefreshOffersListKey(refreshOffersListKey + 1);
          }
        }}
        isOpened={rowOfferId !== null ? true : false}
        rowOfferId={rowOfferId}
        account={account}
        rowFullFillmentId={rowFullFillmentId}
        contract={contract}
        refreshOffersListKey={refreshOffersListKey}
        setRefreshOffersListKey={setRefreshOffersListKey}
        rowFullFillmentExpiryTime={rowFullFillmentExpiryTime}
        setrowFullFillmentExpiryTime={setrowFullFillmentExpiryTime}
        rowFullFillmentQuantityRequested={rowFullFillmentQuantityRequested}
        key={exchangeOfferDrawerKey}
        fullFillmentPaymentProofSubmitted={fullFillmentPaymentProofSubmitted}
        setFullFillmentPaymentProofSubmitted={
          setFullFillmentPaymentProofSubmitted
        }
        selectedToken={selectedToken}
        selectedNetwork={selectedNetwork}
        refreshMySwapOngoingListKey={refreshMySwapOngoingListKey}
        setRefreshMySwapOngoingListKey={setRefreshMySwapOngoingListKey}
        refreshMySwapCompletedListKey={refreshMySwapCompletedListKey}
        setRefreshMySwapCompletedListKey={setRefreshMySwapCompletedListKey}
        selectedBitcoinNode={selectedBitcoinNode}
        btcWalletData={btcWalletData}
        setBTCWalletData={setBTCWalletData}
        getSelectedTokenContractInstance={getSelectedTokenContractInstance}
      />

      <div className={styles.overlay}>
        <GenerateWalletDrawer
          // onClose={generateWalletDrawerhandleClose}
          open={generateWalletDrawerOpen}
          data={generatedBitcoinData}
          generateAddress={setGenerateAddress}
          setPaperWalletDownloaded={setPaperWalletDownloaded}
          paperWalletDownloaded={paperWalletDownloaded}
          setGenerateWalletDrawerOpen={setGenerateWalletDrawerOpen}
        />
      </div>
    </MainLayout>
  );
};

export default Exchange;
