import React, { ReactNode, useEffect, useState } from "react";
import { Box, Center } from "@mantine/core";
import ActionButton from "~/components/ActionButton/ActionButton";
import Button from "~/components/Button/Button";
import GradientBackgroundContainer from "~/components/GradientBackgroundContainer/GradientBackgroundContainer";
import RecentHistoryTable from "~/components/RecentHistoryTable/RecentHistoryTable";
import RecentOngoingTable from "~/components/RecentOngoingTable/RecentOngoingTable";
import Tabs from "~/components/Tabs/Tabs";
import { HistoryTableData, OngoingTableData } from "~/data/recentPage";
import styles from "./Recent.module.scss";
import AllSwapTable from "~/components/AllSwapTable/AllSwapTable";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
import MainLayout from "~/components/MainLayout/MainLayout";
import {
  IFullfillmentEvent,
  IFullfillmentResult,
  IOfferdata,
  IListInitiatedFullfillmentDataByNonEvent,
} from "~/interfaces/IOfferdata";

import { MAX_BLOCKS_TO_QUERY, MAX_ITERATIONS } from "~/Context/Constants";
import { AppContext } from "~/Context/AppContext";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import { StatusEnum } from "~/enums/StatusEnum";
import { ethers } from "ethers";
import SatoshiToBtcConverter from "~/utils/SatoshiToBtcConverter";

import ExchangeOfferDrawer from "~/components/ExchangeOfferDrawer/ExchangeOfferDrawer";
import {
  listInitializeFullfillmentOnGoingByNonEvent,
  listInitializeFullfillmentCompletedByNonEvent,
} from "~/service/AppService";
import { PAGE_SIZE } from "~/Context/Constants";
import { TimeToDateFormat } from "~/utils/TimeConverter";
import { tofixedEther } from "~/utils/Ether.utills";
import { tofixedBTC } from "~/utils/BitcoinUtils";
import { currencyObjects } from "~/Context/Constants";
type Props = {};

const Recent = (props: Props) => {
  return (
    <MainLayout title="" description="">
      <Tabs
        tabs={[
          { label: "My Swaps", value: "my-swaps" },
          { label: "All Swaps", value: "all-swaps" },
        ]}
        panels={[
          {
            value: "my-swaps",
            children: <MySwaps />,
          },
          {
            value: "all-swaps",
            children: <AllSwaps />,
          },
        ]}
      />
    </MainLayout>
  );
};

export default Recent;

function MySwaps() {
  const context = React.useContext(AppContext);
  if (context === null) {
    return <>Loading...</>;
  }

  const {
    //start ongoing variables
    listenedOngoinMySwapOnGoingDataByNonEvent,
    setlistenedOngoinMySwapOnGoingDataByNonEvent,
    refreshMySwapOngoingListKey,
    setRefreshMySwapOngoingListKey,
    mySwapOngoingLoadingText,
    setMySwapOngoingLoadingText,
    isMoreMySwapOngoinTableDataLoading,
    mySwapOngoingfromOfferId,
    setMySwapOngoingfromOfferId,
    //end ongoing variables

    //start ongoing variables
    listenedMySwapCompletedDataByNonEvent,
    setListenedMySwapCompletedDataByNonEvent,

    setMySwapCompletedLoadingText,
    mySwapCompletedLoadingText,
    isMoreMySwapCompletedTableDataLoading,
    mySwapCompletedfromOfferId,
    setMySwapCompletedfromOfferId,
    //end ongoing variables

    account,
    contract,
    selectedToken,
    selectedNetwork,

    refreshMySwapCompletedListKey,
    setRefreshMySwapCompletedListKey,
  } = context;

  const [isMoreOngoingLoading, setMoreOngoingDataLoading] = useState(false);
  const [isMoreHistoryLoading, setMoreHistoryLoading] = useState(false);

  const [rowOfferId, setRowOfferId] = useState<number | null>(null);
  const [rowFullFillmentId, setRowFullFillmentId] = useState<
    string | undefined
  >();
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

  const [selectedCurrencyIcon, setSelectedCurrencyIcon] = useState<
    JSX.Element | string
  >(currencyObjects[selectedNetwork][selectedToken.toLowerCase()].icon);
  useEffect(() => {
    setSelectedCurrencyIcon(
      currencyObjects[selectedNetwork][selectedToken.toLowerCase()].icon
    );
  }, [selectedToken]);

  const callMySwapsOngoing = async () => {
    const mySwapsOngoingList =
      await listInitializeFullfillmentOnGoingByNonEvent(
        contract,
        account,
        mySwapOngoingfromOfferId
      );
    return mySwapsOngoingList;
  };

  const loadMoreOngoing = async () => {
    setMoreOngoingDataLoading(true);
    setMySwapOngoingLoadingText("Loading List");
    callMySwapsOngoing()
      .then((mySwapsOngoingList) => {
        const newOngoingData =
          listenedOngoinMySwapOnGoingDataByNonEvent.concat(mySwapsOngoingList);
        setlistenedOngoinMySwapOnGoingDataByNonEvent(newOngoingData);

        // setTableData(getTableData(listenedOffersByNonEvent.offers));
        setMoreOngoingDataLoading(false);
        setMySwapOngoingLoadingText("");

        let mySwapOngoingfromOfferId_ =
          mySwapOngoingfromOfferId - PAGE_SIZE > 0
            ? mySwapOngoingfromOfferId - PAGE_SIZE
            : 0;
        setMySwapOngoingfromOfferId(mySwapOngoingfromOfferId_);
        console.log(mySwapsOngoingList);
      })
      .catch((err) => {
        console.log(err);
        setMoreOngoingDataLoading(false);
        setMySwapOngoingLoadingText("");
      });
  };

  const callMySwapsCompleted = async () => {
    const mySwapsCompletedList =
      await listInitializeFullfillmentCompletedByNonEvent(
        contract,
        account,
        mySwapCompletedfromOfferId
      );
    return mySwapsCompletedList;
  };
  const loadMorHeistory = async () => {
    setMoreHistoryLoading(true);
    setMySwapCompletedLoadingText("Loading List");
    callMySwapsCompleted()
      .then((mySwapsOngoingList) => {
        const newOngoingData =
          listenedMySwapCompletedDataByNonEvent.concat(mySwapsOngoingList);
        setListenedMySwapCompletedDataByNonEvent(newOngoingData);

        // setTableData(getTableData(listenedOffersByNonEvent.offers));
        setMoreHistoryLoading(false);
        setMySwapCompletedLoadingText("");

        let mySwapCompletedfromOfferId_ =
          mySwapCompletedfromOfferId - PAGE_SIZE > 0
            ? mySwapCompletedfromOfferId - PAGE_SIZE
            : 0;
        setMySwapCompletedfromOfferId(mySwapCompletedfromOfferId_);
        console.log(mySwapsOngoingList);
      })
      .catch((err) => {
        console.log(err);
        setMoreHistoryLoading(false);
        setMySwapCompletedLoadingText("");
      });
  };
  const handleSubmitPaymentProof = (
    fullfillmentRequestId: string | undefined,
    offerId: number,
    fullfillmentExpiryTime: string | undefined,
    quantityRequested: string | undefined,
    paymentProofSubmitted: boolean | undefined
  ) => {
    setRowFullFillmentId(fullfillmentRequestId);
    setRowOfferId(offerId);
    setrowFullFillmentExpiryTime(fullfillmentExpiryTime);
    setRowFullFillmentQuantityRequested(quantityRequested);
    setExchangeOfferDrawerKey(exchangeOfferDrawerKey + 1);
    setFullFillmentPaymentProofSubmitted(paymentProofSubmitted);
  };

  const showLoadMoreMySwapOngoingButton = () => {
    if (mySwapOngoingfromOfferId > 0 && mySwapOngoingLoadingText == "") {
      return true;
    } else {
      return false;
    }
  };
  const OngoingTableData2 = listenedOngoinMySwapOnGoingDataByNonEvent
    ?.filter(function (
      value: IListInitiatedFullfillmentDataByNonEvent,
      key: number
    ) {
      // return true;
      let fullfillmentRequestId =
        value.offerDetailsInJson.fullfillmentRequestId;
      let fullfillmentExpiryTime = value.offerDetailsInJson
        ?.fulfillmentRequestExpiryTime
        ? parseInt(value.offerDetailsInJson?.fulfillmentRequestExpiryTime)
        : 0;
      if (fullfillmentRequestId) {
        let currentTimestamp = Date.now();

        if (fullfillmentExpiryTime * 1000 >= currentTimestamp) {
          return true;
        }
        return false;
      }
      return true;
    })
    .map((value, key) => {
      // let fulfillmentBy: string = value?.offerDetailsInJson.fulfillmentBy;
      let planningToSell = Number(
        tofixedEther(
          Number(
            ethers.utils.formatEther(value.offerDetailsInJson.offerQuantity)
          )
        )
      );
      let planningToBuyAmount = Number(
        tofixedBTC(
          Number(
            SatoshiToBtcConverter(value.offerDetailsInJson.satoshisToReceive)
          )
        )
      );
      let rateInBTC = Number(tofixedBTC(planningToBuyAmount / planningToSell));
      let offerType = value.offerDetailsInJson.offerType;

      let OrderSellAmount;
      if (offerType == "my_offer") {
        OrderSellAmount = planningToSell;
      } else if (offerType == "my_order") {
        OrderSellAmount = Number(
          tofixedBTC(
            Number(
              SatoshiToBtcConverter(
                value.offerDetailsInJson
                  .fulfillmentRequestQuantityRequested as string
              )
            ) / rateInBTC
          )
        );
      }
      let orderBuyAmount;
      if (offerType == "my_offer") {
        orderBuyAmount = planningToBuyAmount;
      } else if (offerType == "my_order") {
        orderBuyAmount = Number(
          tofixedBTC(
            Number(
              SatoshiToBtcConverter(
                value.offerDetailsInJson
                  .fulfillmentRequestQuantityRequested as string
              )
            )
          )
        );
      }
      let row = {
        orderNumber: value.offerDetailsInJson.offerId.toString(),
        planningToSell: {
          amount: OrderSellAmount,
          type: selectedCurrencyIcon,
        },
        planningToBuy: {
          amount: orderBuyAmount,
          type: CurrencyEnum.BTC,
        },
        rateInBTC: rateInBTC,
        progress: value.offerDetailsInJson.progress, //TimestampTofromNow(value?.offersFullfillmentJson.expiryTime),
        offerType: value.offerDetailsInJson.offerType,
        fullfillmentRequestId: value.offerDetailsInJson.fullfillmentRequestId,
        offerId: value.offerDetailsInJson.offerId,
        fullfillmentExpiryTime:
          value.offerDetailsInJson?.fulfillmentRequestExpiryTime,
        quantityRequested:
          value.offerDetailsInJson?.fulfillmentRequestQuantityRequested,
        paymentProofSubmitted:
          value.offerDetailsInJson?.fulfillmentRequestPaymentProofSubmitted,
        offerData: value,
      };
      return row;
    });

  const showLoadMoreMySwapCompletedButton = () => {
    if (mySwapCompletedfromOfferId > 0 && mySwapCompletedLoadingText == "") {
      return true;
    } else {
      return false;
    }
  };
  const HistoryTableData2 = listenedMySwapCompletedDataByNonEvent.map(
    (value, index, data) => {
      // console.log(value);
      let offerType = value.offerDetailsInJson.offerType;
      let planningToSell = Number(
        tofixedEther(
          Number(
            ethers.utils.formatEther(value.offerDetailsInJson.offerQuantity)
          )
        )
      );
      let planningToBuyAmount = Number(
        tofixedBTC(
          Number(
            SatoshiToBtcConverter(value.offerDetailsInJson.satoshisToReceive)
          )
        )
      );
      let rateInBTC = Number(tofixedBTC(planningToBuyAmount / planningToSell));
      let OrderSellAmount;
      if (offerType == "my_offer") {
        OrderSellAmount = planningToSell;
      } else if (offerType == "my_order") {
        OrderSellAmount = Number(
          tofixedBTC(
            Number(
              SatoshiToBtcConverter(
                value.offerDetailsInJson
                  .fulfillmentRequestQuantityRequested as string
              )
            ) / rateInBTC
          )
        );
      }
      let orderBuyAmount;
      if (offerType == "my_offer") {
        orderBuyAmount = planningToBuyAmount;
      } else if (offerType == "my_order") {
        orderBuyAmount = Number(
          tofixedBTC(
            Number(
              SatoshiToBtcConverter(
                value.offerDetailsInJson
                  .fulfillmentRequestQuantityRequested as string
              )
            )
          )
        );
      }

      let row = {
        orderNumber: value.offerDetailsInJson.offerId.toString(),
        planningToSell: {
          amount: OrderSellAmount,
          type: CurrencyEnum.ETH,
        },
        planningToBuy: {
          amount: orderBuyAmount,
          type: CurrencyEnum.BTC,
        },
        rateInBTC: rateInBTC,

        date:
          offerType == "my_offer"
            ? TimeToDateFormat(value.offerDetailsInJson.orderedTime)
            : TimeToDateFormat(
                value.offerDetailsInJson.fulfillmentRequestfulfilledTime
              ), //"09 Jan, 13:45pm",
        status: StatusEnum.Completed,
      };
      return row;
    }
  );

  return (
    <div className={styles.panelCont}>
      <GradientBackgroundContainer colorLeft="#FFD57243">
        <Box p={"lg"} className={styles.box}>
          <div className={styles.recentTable}>
            <RecentOngoingTable
              tableCaption="Ongoing"
              cols={[
                "# of order",
                "Selling",
                "Asking",
                "Price in BTC",
                "Progress",
                "Actions",
              ]}
              data={OngoingTableData2}
              handleSubmitPaymentProof={handleSubmitPaymentProof}
              mySwapOngoingLoadingText={mySwapOngoingLoadingText}
              contract={contract}
              selectedToken={selectedToken}
              selectedNetwork={selectedNetwork}
            />
          </div>
          <div className={styles.recentMobileTable}>
            <RecentOngoingTable
              tableCaption="Ongoing"
              cols={["Sell", "Buy", "Progress", ""]}
              data={OngoingTableData}
              mobile={true}
              handleSubmitPaymentProof={handleSubmitPaymentProof}
              mySwapOngoingLoadingText={mySwapCompletedLoadingText}
              contract={contract}
              selectedToken={selectedToken}
              selectedNetwork={selectedNetwork}
            />
          </div>
          <br />
          <Center>
            {mySwapCompletedLoadingText != "" ? (
              <ActionButton
                variant={"transparent"}
                loading={isMoreMySwapCompletedTableDataLoading}
              >
                {mySwapCompletedLoadingText}
              </ActionButton>
            ) : (
              ""
            )}
            {showLoadMoreMySwapOngoingButton() == true ? (
              <ActionButton
                variant={"transparent"}
                loading={isMoreOngoingLoading}
                onClick={loadMoreOngoing}
              >
                Load more
              </ActionButton>
            ) : (
              ""
            )}
          </Center>
        </Box>
        <ExchangeOfferDrawer
          onClose={() => {
            setRowOfferId(null);
          }}
          isOpened={rowOfferId !== null ? true : false}
          rowOfferId={rowOfferId}
          account={account}
          rowFullFillmentId={rowFullFillmentId}
          contract={contract}
          refreshOffersListKey={refreshMySwapOngoingListKey}
          setRefreshOffersListKey={setRefreshMySwapOngoingListKey}
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
        />
      </GradientBackgroundContainer>
      {/* Star My Swap completed History */}
      <GradientBackgroundContainer colorLeft="#FFD57243">
        <Box p={"lg"} className={styles.box}>
          <div className={styles.historyTable}>
            <RecentHistoryTable
              tableCaption="History"
              cols={[
                "# of order",
                "Selling",
                "Asking",
                "Price in BTC",
                "Date",
                "Status",
              ]}
              data={HistoryTableData2}
              selectedToken={selectedToken}
              selectedNetwork={selectedNetwork}
            />
          </div>
          <div className={styles.mobileHistoryTable}>
            <RecentHistoryTable
              tableCaption="History"
              cols={["# of order", "Date", "More Details"]}
              mobile={true}
              data={HistoryTableData}
              selectedToken={selectedToken}
              selectedNetwork={selectedNetwork}
            />
          </div>
          <br />
          <Center>
            {mySwapCompletedLoadingText != "" ? (
              <ActionButton
                variant={"transparent"}
                loading={isMoreMySwapCompletedTableDataLoading}
              >
                {mySwapCompletedLoadingText}
              </ActionButton>
            ) : (
              ""
            )}

            {showLoadMoreMySwapCompletedButton() == true ? (
              <ActionButton
                variant={"transparent"}
                loading={isMoreHistoryLoading}
                onClick={loadMorHeistory}
              >
                Load more
              </ActionButton>
            ) : (
              ""
            )}
          </Center>
        </Box>
      </GradientBackgroundContainer>
      {/* End My Swap completed History */}
    </div>
  );
}

function AllSwaps() {
  const context = React.useContext(AppContext);
  if (context === null) {
    return <>Loading...</>;
  }

  const {
    //start All completed variables
    listenedMySwapAllCompletedDataByNonEvent,
    setListenedMySwapAllCompletedDataByNonEvent,
    refreshMySwapAllCompletedListKey,
    setRefreshMySwapAllCompletedListKey,
    setMySwapAllCompletedLoadingText,
    mySwapAllCompletedLoadingText,
    isMoreMySwapAllCompletedTableDataLoading,
    mySwapAllCompletedfromOfferId,
    setMySwapAllCompletedfromOfferId,
    //end All completed variables
    account,
    selectedToken,
    selectedNetwork,
    getSelectedTokenContractInstance,
  } = context;

  const { mobileView } = useWindowDimensions();

  const [selectedCurrencyIcon, setSelectedCurrencyIcon] = useState<
    JSX.Element | string
  >(currencyObjects[selectedNetwork][selectedToken.toLowerCase()].icon);
  useEffect(() => {
    setSelectedCurrencyIcon(
      currencyObjects[selectedNetwork][selectedToken.toLowerCase()].icon
    );
  }, [selectedToken]);

  const HistoryTableData2 = listenedMySwapAllCompletedDataByNonEvent.map(
    (value, key) => {
      // let fulfillmentBy: string = value?.offerDetailsInJson.fulfillmentBy;
      let planningToSell = Number(
        tofixedEther(
          Number(
            ethers.utils.formatEther(value.offerDetailsInJson.offerQuantity)
          )
        )
      );
      let planningToBuyAmount = Number(
        tofixedBTC(
          Number(
            SatoshiToBtcConverter(value.offerDetailsInJson.satoshisToReceive)
          )
        )
      );
      let rateInBTC = Number(tofixedBTC(planningToBuyAmount / planningToSell));
      let offerType = value.offerDetailsInJson.offerType;

      let OrderSellAmount;
      OrderSellAmount = planningToSell;

      let orderBuyAmount;
      orderBuyAmount = planningToBuyAmount;
      let row = {
        orderNumber: value.offerDetailsInJson.offerId.toString(),
        planningToSell: {
          amount: OrderSellAmount,
          type: selectedCurrencyIcon,
        },
        planningToBuy: {
          amount: orderBuyAmount,
          type: CurrencyEnum.BTC,
        },
        rateInBTC: rateInBTC,

        date: TimeToDateFormat(value.offerDetailsInJson.orderedTime),
        status: StatusEnum.Completed,
      };
      return row;
    }
  );

  const [isMoreSwapsLoading, setMoreSwapsLoading] = useState(false);
  // const [swapData, setSwapData] = useState(HistoryTableData2);

  const callMySwapsCompleted = async () => {
    let mySwapsAllCompletedList: IListInitiatedFullfillmentDataByNonEvent[] =
      [];
    let contract = getSelectedTokenContractInstance();
    if (contract) {
      mySwapsAllCompletedList =
        await listInitializeFullfillmentCompletedByNonEvent(
          contract,
          account,
          mySwapAllCompletedfromOfferId
        );
    }
    return mySwapsAllCompletedList;
  };

  // const loadMoreSwaps = () => {
  //   setMoreSwapsLoading(true);
  //   setTimeout(() => {
  //     // setSwapData([...swapData, ...HistoryTableData2]);
  //     setMoreSwapsLoading(false);
  //   }, 2000);
  // };

  const loadMoreSwaps = async () => {
    setMoreSwapsLoading(true);
    setMySwapAllCompletedLoadingText("Loading List");
    callMySwapsCompleted()
      .then((mySwapsOngoingList) => {
        const newOngoingData =
          listenedMySwapAllCompletedDataByNonEvent.concat(mySwapsOngoingList);
        setListenedMySwapAllCompletedDataByNonEvent(newOngoingData);
        setMoreSwapsLoading(false);
        setMySwapAllCompletedLoadingText("");

        let mySwapCompletedfromOfferId_ =
          mySwapAllCompletedfromOfferId - PAGE_SIZE > 0
            ? mySwapAllCompletedfromOfferId - PAGE_SIZE
            : 0;
        setMySwapAllCompletedfromOfferId(mySwapCompletedfromOfferId_);
        // console.log(mySwapsOngoingList);
      })
      .catch((err) => {
        console.log(err);
        setMoreSwapsLoading(false);
        setMySwapAllCompletedLoadingText("");
      });
  };

  const showLoadMoreMySwapOngoingButton = () => {
    if (
      mySwapAllCompletedfromOfferId > 0 &&
      mySwapAllCompletedLoadingText == ""
    ) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <GradientBackgroundContainer colorLeft="#FFD57243">
      <Box p={"lg"} className={styles.box}>
        <AllSwapTable
          data={HistoryTableData2}
          cols={
            mobileView
              ? ["# of order", "Date", "More Details"]
              : [
                  "# of order",
                  "Planning to sell",
                  "Planning to buy",
                  "Price per ETH in BTC",
                  "Date",
                  "Status",
                ]
          }
          tableCaption="All Swaps"
        />
        <br />
        <Center>
          {mySwapAllCompletedLoadingText != "" ? (
            <ActionButton
              variant={"transparent"}
              loading={isMoreMySwapAllCompletedTableDataLoading}
            >
              {mySwapAllCompletedLoadingText}
            </ActionButton>
          ) : (
            ""
          )}
          {showLoadMoreMySwapOngoingButton() == true ? (
            <ActionButton
              variant={"transparent"}
              loading={isMoreSwapsLoading}
              onClick={loadMoreSwaps}
            >
              Load more
            </ActionButton>
          ) : (
            ""
          )}
        </Center>
      </Box>
    </GradientBackgroundContainer>
  );
}
