import { Center } from "@mantine/core";
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
} from "~/service/AppService";
import BtcToSatoshiConverter from "~/utils/BtcToSatoshiConverter";
import { IListenedOfferData } from "~/interfaces/IOfferdata";
import SatoshiToBtcConverter from "~/utils/SatoshiToBtcConverter";
import { NumberToTime, TimeToNumber } from "~/utils/TimeConverter";
import { ethers } from "ethers";
import {
  generateBitcoinWallet,
  generateTrustlexAddress,
} from "~/utils/BitcoinUtils";
import GenerateWalletDrawer from "~/components/GenerateWalletDrawer/GenerateWalletDrawer";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
type Props = {};

// const tableDummyData: string[][] = new Array(5).fill([
//   1211,
//   <>
//     10 <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.ETH)} />{" "}
//     {CurrencyEnum.ETH}
//   </>,
//   <>
//     0.078 <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.BTC)} />{" "}
//     {CurrencyEnum.BTC}
//   </>,
//   <>
//     0.078 <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.BTC)} />{" "}
//     {CurrencyEnum.BTC}
//   </>,
//   <>
//     1 out of 10 <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.ETH)} />{" "}
//     {CurrencyEnum.ETH}
//   </>,
//   "1h",
//   "09 Jan, 13:45pm",
// ]);

// const mobileTableDummyData: string[][] = new Array(5).fill([
//   1211,

//   "09 Jan, 13:45pm",
//   <SeeMoreButton
//     onClick={(e) => {
//       // console.log("button clicked");
//     }}
//   />,
// ]);

const Exchange = (props: Props) => {
  const [isMoreTableDataLoading, setMoreTableDataLoading] = useState(false);

  const [rowData, setRowData] = useState<(string | ReactNode)[] | null>(null);

  const context = React.useContext(AppContext);
  if (context === null) {
    return <>Loading...</>;
  }

  const {
    listenedOfferData,
    setListenedOfferData,
    userInputData,
    setUserInputData,
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

  const mobileData = listenedOfferData.map((offer: IListenedOfferData) => {
    return [
      offer.offerDetailsInJson.offeredBlockNumber,
      "09 Jan, 13:45pm",
      <SeeMoreButton onClick={(e) => {}} />,
    ];
  });

  const [mobileTableData, setMobileTableData] =
    useState<(string | JSX.Element)[][]>(mobileData);

  const getTableData = (offers: IListenedOfferData[]) => {
    return offers.map((offer: IListenedOfferData) => {
      return [
        offer.offerDetailsInJson.offeredBlockNumber,
        <>
          {ethers.utils.formatEther(offer.offerDetailsInJson.offerQuantity)}{" "}
          <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.ETH)} />
          {CurrencyEnum.ETH}
        </>,
        <>
          {SatoshiToBtcConverter(offer.offerDetailsInJson.satoshisToReceive)}{" "}
          <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.BTC)} />{" "}
          {CurrencyEnum.BTC}
        </>,
        <>
          0.078 <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.BTC)} />{" "}
          {CurrencyEnum.BTC}
        </>,
        <>
          1 out of 10
          <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.ETH)} />{" "}
          {CurrencyEnum.ETH}
        </>,
        NumberToTime(offer.offerDetailsInJson.offerValidTill),
        "09 Jan, 13:45pm",
      ];
    });
  };

  let data = getTableData(listenedOfferData);

  const [tableData, setTableData] = useState<(string | JSX.Element)[][]>(data);
  const [generateWalletDrawerOpen, setGenerateWalletDrawerOpen] =
    useState(false);

  const loadMoreOffers = () => {
    setMoreTableDataLoading(true);
    setTimeout(() => {
      // setTableData([...tableData, ...tableDummyData]);
      // setMobileTableData([...mobileTableData, ...mobileTableDummyData]);
      setMoreTableDataLoading(false);
    }, 2000);
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
    console.log("Offer confirmed");

    const data = {
      satoshis: BtcToSatoshiConverter(userInputData.activeExchange[0].value),
      bitcoinAddress: exchangeData.address,
      offerValidTill: TimeToNumber(exchangeData.valid),
    };
    const addedOffer = await AddOfferWithEth(context.contract, data);
    if (addedOffer.hash !== "") {
      setHashedOfferData(addedOffer.hash);
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

        const exists = listenedOfferData.find(
          (offer) =>
            offer.offerDetailsInJson.offeredBlockNumber ===
            offerDetailsInJson.offeredBlockNumber
        );
        if (exists === undefined) {
          setListenedOfferData([
            ...listenedOfferData,
            { offerEvent, offerDetailsInJson },
          ]);
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
  useEffect(() => {
    listenEvent();
    listOffers(context.contract).then((offers) => {
      setListenedOfferData(offers.offers);
      setTableData(getTableData(offers.offers));
    });
  }, [hashedOfferData]);

  const handleGenerateBitcoinWallet = async () => {
    const data = generateBitcoinWallet();
    console.log(data);
    console.log(generateTrustlexAddress(data.pubkeyHash, "10"));
  };

  handleGenerateBitcoinWallet();
  const { mobileView } = useWindowDimensions();

  return (
    <div className={styles.root}>
      <h1 className={styles.pageTitle}>Exchange</h1>
      <p className={styles.pageDesc}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>

      <div className={styles.exchangeForm}>
        <GradientBackgroundContainer
          colorRight="#FEBD3863"
          colorLeft="#FEBD3833"
          bgImage="/images/Rectangle.svg"
        >
          <div className={styles.exchangeFormContent}>
            <SpanFullGridWidth>
              <ExchangeSwapGroup />
            </SpanFullGridWidth>
            {userInputData.activeExchange[0].currency === "btc" && (
              <>
                <InputWithSelect
                  options={data2}
                  type="number"
                  value={userInputData.limit}
                  onChange={handleLimitChange}
                  placeholder={"Limit price BTC/ETC"}
                  disabled={userInputData.setLimit ? false : true}
                />
                <div className={styles.temporary}></div>

                <SpanFullGridWidth>
                  <div className={styles.addressBox}>
                    {exchangeData.address === "" && (
                      <div
                        className={styles.generateAddressButton}
                        onClick={() => setGenerateWalletDrawerOpen(true)}
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
                    )}

                    <Input
                      type="text"
                      label="Address to receive Bitcoin"
                      placeholder="Type here"
                      value={exchangeData.address}
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
                      <ImageIcon image="/icons/info.svg" /> Minimum Collateral{" "}
                    </span>
                  }
                  onChange={handleCollateralChange}
                  value={exchangeData.collateral}
                  data={minCollateral}
                />
              </>
            )}
            <Button
              variant={VariantsEnum.primary}
              radius={10}
              fullWidth
              onClick={handleOfferConfirm}
            >
              Confirm
            </Button>
          </div>
        </GradientBackgroundContainer>
      </div>

      <div className={styles.offersTable}>
        <GradientBackgroundContainer
          colorRight="#FEBD3863"
          colorLeft="#FEBD3833"
        >
          <div className={styles.innerWrapper}>
            <div className={styles.tableInner}>
              <Table
                tableCaption="All offers"
                cols={exchangeTableCols}
                data={tableData}
                verticalSpacing={"lg"}
                onRowClick={(data) => {
                  console.log(data);
                  setRowData(data);
                }}
              />
            </div>
            <div className={styles.mobileTableInner}>
              <Table
                tableCaption="All offers"
                cols={exchangeMobileTableCols}
                data={mobileTableData}
                verticalSpacing={"lg"}
                horizontalSpacing={"xs"}
                onRowClick={(data) => setRowData(data)}
              />
            </div>
            <br />
            <Center>
              <ActionButton
                variant={"transparent"}
                loading={isMoreTableDataLoading}
                onClick={loadMoreOffers}
              >
                Load more
              </ActionButton>
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
        />
      </div>
    </div>
  );
};

export default Exchange;
