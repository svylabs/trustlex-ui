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
import { AppContext } from "~/Context/AppContext";
import {
  AddOfferWithEth,
  InitializeFullfillment,
  connect,
  getOffers,
  listOffers,
  getTotalOffers,
  getOffersList,
} from "~/service/AppService";
import BtcToSatoshiConverter from "~/utils/BtcToSatoshiConverter";
import { IListenedOfferData } from "~/interfaces/IOfferdata";
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
import GenerateWalletDrawer from "~/components/GenerateWalletDrawer/GenerateWalletDrawer";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
import MainLayout from "~/components/MainLayout/MainLayout";
import {
  MAX_BLOCKS_TO_QUERY,
  MAX_ITERATIONS,
  PAGE_SIZE,
  OfferListOrderBy,
} from "~/Context/Constants";
import Loading from "~/components/Loading/Loading";
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

  const [generateAddress, setGenerateAddress] = useState("");

  const [confirm, setConfirm] = useState("none");

  const [addOffer, setAddOffer] = useState(false);

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
  } = context;

  const [exchangeData, setExchangeData] = useState({
    address: "",
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

  const getTableData = (offers: IListenedOfferData[]) => {
    return offers.map((offer: IListenedOfferData) => {
      // console.log(offer);
      const planningToSell = Number(
        SatoshiToBtcConverter(offer.offerDetailsInJson.satoshisToReceive)
      ).toFixed(4);
      const offerQuantity = ethers.utils.formatEther(
        offer.offerDetailsInJson.offerQuantity
      );
      const price_per_ETH_in_BTC =
        Number(
          SatoshiToBtcConverter(offer.offerDetailsInJson.satoshisToReceive)
        ) /
        Number(
          ethers.utils.formatEther(offer.offerDetailsInJson.offerQuantity)
        );
      const satoshisToReceive = Number(
        offer.offerDetailsInJson.satoshisToReceive
      );
      const satoshisReserved = Number(
        offer.offerDetailsInJson.satoshisReserved
      );
      const satoshisReceived = Number(
        offer.offerDetailsInJson.satoshisReceived
      );
      const left_to_buy =
        Number(
          SatoshiToBtcConverter(
            satoshisToReceive - (satoshisReserved + satoshisReceived)
          )
        ) / price_per_ETH_in_BTC;

      return [
        // offer.offerDetailsInJson.offeredBlockNumber,
        // offer.offerEvent.to.toString(),
        offer.offerDetailsInJson.offerId,
        <>
          {offerQuantity}{" "}
          <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.ETH)} />
          {CurrencyEnum.ETH}
        </>,
        <>
          {planningToSell}{" "}
          <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.BTC)} />{" "}
          {CurrencyEnum.BTC}
        </>,
        <>
          {price_per_ETH_in_BTC.toFixed(4)}{" "}
          <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.BTC)} />{" "}
          {CurrencyEnum.BTC}
        </>,
        <>
          {left_to_buy}{" "}
          <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.ETH)} />
          {CurrencyEnum.ETH}
        </>,
        NumberToTime(offer.offerDetailsInJson.offerValidTill),
        TimeToDateFormat(offer.offerDetailsInJson.orderedTime),
      ];
    });
  };

  // let data = getTableData(listenedOfferData.offers);
  // console.log("data", data);

  const [generatedBitcoinData, setGeneratedBitcoinData] =
    useState<Wallet | null>(null);
  // const [tableData, setTableData] = useState<(string | JSX.Element)[][]>(data);
  const [tableData, setTableData] = useState<(string | JSX.Element)[][]>([]);
  const [generateWalletDrawerOpen, setGenerateWalletDrawerOpen] =
    useState(false);

  const loadMoreOffers = async () => {
    setMoreTableDataLoading(true);
    let fromBlock = Math.max(
      0,
      listenedOfferData.fromBlock - MAX_ITERATIONS * MAX_BLOCKS_TO_QUERY
    );

    listOffers(
      context.contract,
      fromBlock,
      listenedOfferData.fromBlock - 1
    ).then((offers) => {
      const listenedOffers = {
        fromBlock: offers.fromBlock,
        toBlock: listenedOfferData.toBlock,
        offers: [...listenedOfferData.offers, ...offers.offers],
      };
      setListenedOfferData(listenedOffers);
      setTableData(getTableData(listenedOffers.offers));
      setMoreTableDataLoading(false);
      console.log(listenedOffers);
    });
  };
  const loadMoreOffersByNonEvent = async () => {
    setMoreTableDataLoading(true);

    callOffersListService().then((offers) => {
      const listenedOffersByNonEvent = {
        offers: [...listenedOfferDataByNonEvent.offers, ...offers.offers],
      };
      setListenedOfferDataByNonEvent(listenedOffersByNonEvent);
      setTableData(getTableData(listenedOffersByNonEvent.offers));
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
  const handleOfferConfirm = async () => {
    setConfirm("loading");
    try {
      console.log(generatedBitcoinData?.pubkeyHash.toString("hex"));

      let inputEther: string = userInputData.activeExchange[1].value;
      const data = {
        weieth: EthtoWei(inputEther),
        satoshis: BtcToSatoshiConverter(userInputData.activeExchange[0].value),
        bitcoinAddress: generatedBitcoinData?.pubkeyHash.toString("hex"),
        offerValidTill: TimeToNumber(exchangeData.valid),
        account: "0xf72B8291b10eC381e55DE4788F6EBBB7425cF34e",
      };

      const addedOffer = await AddOfferWithEth(context.contract, data);
      console.log(addedOffer);
      if (addedOffer.hash !== "") {
        setHashedOfferData(addedOffer.hash);
        setConfirm("confirmed");
        setTimeout(() => {
          setConfirm("none");
          setAddOffer(false);
          //fertch the data again
          setRefreshOffersListKey(refreshOffersListKey + 1);
        }, 3000);
      }
    } catch (error) {
      setConfirm("none");
    }
  };

  const listentotheEvent = async () => {
    try {
      const trustLex = context.contract;
      if (!trustLex) return false;

      trustLex.on("NEW_OFFER", async (from, to, value) => {
        const offerEvent = {
          from: from.toString(),
          to: to.toString(),
          value: value,
        };

        const offerData = await getOffers(trustLex, to);
        const offerDetailsInJson = {
          offerQuantity: offerData[0].toString(),
          offeredBy: offerData[1].toString(),
          offerValidTill: offerData[2].toString(),
          orderedTime: offerData[3].toString(),
          offeredBlockNumber: offerData[4].toString(),
          bitcoinAddress: offerData[5].toString(),
          satoshisToReceive: offerData[6].toString(),
          satoshisReceived: offerData[7].toString(),
          satoshisReserved: offerData[8].toString(),
          collateralPer3Hours: offerData[9].toString(),
        };

        const exists = listenedOfferData.offers.find(
          (offer) =>
            offer.offerDetailsInJson.offeredBlockNumber ===
            offerDetailsInJson.offeredBlockNumber
        );
        if (exists === undefined) {
          setListenedOfferData({
            fromBlock: listenedOfferData.fromBlock,
            toBlock: offerDetailsInJson.offeredBlockNumber,
            offers: [
              ...listenedOfferData.offers,
              { offerEvent, offerDetailsInJson },
            ],
          });
          setTableData((prev) => {
            return [
              ...prev,

              [
                offerDetailsInJson.offeredBlockNumber,
                <>
                  10{" "}
                  <ImageIcon
                    image={getIconFromCurrencyType(CurrencyEnum.ETH)}
                  />
                  {CurrencyEnum.ETH}
                </>,
                <>
                  {SatoshiToBtcConverter(offerDetailsInJson.satoshisToReceive)}{" "}
                  <ImageIcon
                    image={getIconFromCurrencyType(CurrencyEnum.BTC)}
                  />{" "}
                  {CurrencyEnum.BTC}
                </>,
                <>
                  0.078{" "}
                  <ImageIcon
                    image={getIconFromCurrencyType(CurrencyEnum.BTC)}
                  />{" "}
                  {CurrencyEnum.BTC}
                </>,
                <>
                  1 out of 10
                  <ImageIcon
                    image={getIconFromCurrencyType(CurrencyEnum.ETH)}
                  />{" "}
                  {CurrencyEnum.ETH}
                </>,
                NumberToTime(offerDetailsInJson.offerValidTill),
                "09 Jan, 13:45pm",
              ],
            ];
          });
          setMobileTableData((prev) => {
            return [
              ...prev,
              offerDetailsInJson.offeredBlockNumber,
              "09 Jan, 13:45pm",
              <SeeMoreButton
                onClick={(e) => {
                  // console.log("button clicked");
                }}
              />,
            ];
          });
        } else {
          console.log("already exists");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const listenEvent = async () => {
    await listentotheEvent();
  };
  // useEffect(() => {
  //   listenEvent();
  //   listOffers(context.contract).then((offers) => {
  //     setListenedOfferData(offers);
  //     setTableData(getTableData(offers.offers));
  //   });
  // }, [hashedOfferData]);

  useEffect(() => {
    if (listenedOfferDataByNonEvent?.offers) {
      const result = getTableData(listenedOfferDataByNonEvent?.offers);
      setTableData(result);
    }
  }, [listenedOfferDataByNonEvent]);

  const handleGenerateBitcoinWallet = async () => {
    const data = generateBitcoinWallet();
    setGeneratedBitcoinData(data);
  };

  useEffect(() => {
    setExchangeData((prev) => {
      return { ...prev, address: generateAddress };
    });
  }, [generateAddress]);

  // handleGenerateBitcoinWallet();
  const { mobileView } = useWindowDimensions();

  return (
    <MainLayout
      title="Exchange"
      description="  Lorem ipsum dolor sit amet consectetur adipisicing elit."
    >
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
                    <button onClick={() => setAddOffer(false)}>Cancel</button>
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
                        />
                        <div className={styles.temporary}></div>
                        <Select
                          label={
                            <span className={styles.collateralLabel}>
                              <ImageIcon image="/icons/info.svg" /> Minimum
                              Collateral{" "}
                            </span>
                          }
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
                onRowClick={(data) => {
                  setRowData(data);
                }}
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
                onRowClick={(data) => setRowData(data)}
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
        onClose={() => setRowData(null)}
        isOpened={rowData !== null ? true : false}
        data={rowData}
      />

      <div className={styles.overlay}>
        <GenerateWalletDrawer
          onClose={() => setGenerateWalletDrawerOpen(false)}
          open={generateWalletDrawerOpen}
          data={generatedBitcoinData}
          generateAddress={setGenerateAddress}
        />
      </div>
    </MainLayout>
  );
};

export default Exchange;
