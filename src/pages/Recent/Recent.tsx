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
type Props = {};

const Recent = (props: Props) => {
  return (
    <MainLayout
      title="Recents"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
    >
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
    refreshMySwapCompletedListKey,
    setRefreshMySwapCompletedListKey,
    setMySwapCompletedLoadingText,
    mySwapCompletedLoadingText,
    isMoreMySwapCompletedTableDataLoading,
    mySwapCompletedfromOfferId,
    setMySwapCompletedfromOfferId,
    //end ongoing variables

    account,
    contract,
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
    rowFullFillmentQuantityRequested,
    setRowFullFillmentQuantityRequested,
  ] = useState<string | undefined>();
  const [exchangeOfferDrawerKey, setExchangeOfferDrawerKey] =
    useState<number>(0);

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
  const loadMorHeistory2 = () => {
    setMoreHistoryLoading(true);
    setTimeout(() => {
      setMoreHistoryLoading(false);
    }, 2000);
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
    quantityRequested: string | undefined
  ) => {
    setRowFullFillmentId(fullfillmentRequestId);
    setRowOfferId(offerId);
    setrowFullFillmentExpiryTime(fullfillmentExpiryTime);
    setRowFullFillmentQuantityRequested(quantityRequested);
    setExchangeOfferDrawerKey(exchangeOfferDrawerKey + 1);
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
      let row = {
        orderNumber: value.offerDetailsInJson.offerId.toString(),
        planningToSell: {
          amount: Number(
            ethers.utils.formatEther(value.offerDetailsInJson.offerQuantity)
          ),
          type: CurrencyEnum.ETH,
        },
        planningToBuy: {
          amount: Number(
            Number(
              SatoshiToBtcConverter(value.offerDetailsInJson.satoshisToReceive)
            ).toFixed(4)
          ),
          type: CurrencyEnum.BTC,
        },
        rateInBTC: Number(
          Number(
            Number(
              SatoshiToBtcConverter(value.offerDetailsInJson.satoshisToReceive)
            ) /
              Number(
                ethers.utils.formatEther(value.offerDetailsInJson.offerQuantity)
              )
          ).toFixed(4)
        ),
        progress: value.offerDetailsInJson.progress, //TimestampTofromNow(value?.offersFullfillmentJson.expiryTime),
        offerType: value.offerDetailsInJson.offerType,
        fullfillmentRequestId: value.offerDetailsInJson.fullfillmentRequestId,
        offerId: value.offerDetailsInJson.offerId,
        fullfillmentExpiryTime:
          value.offerDetailsInJson?.fulfillmentRequestExpiryTime,
        quantityRequested:
          value.offerDetailsInJson?.fulfillmentRequestQuantityRequested,
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
      let row = {
        orderNumber: value.offerDetailsInJson.offerId.toString(),
        planningToSell: {
          amount: Number(
            ethers.utils.formatEther(value.offerDetailsInJson.offerQuantity)
          ),
          type: CurrencyEnum.ETH,
        },
        planningToBuy: {
          amount: Number(
            Number(
              SatoshiToBtcConverter(value.offerDetailsInJson.satoshisToReceive)
            ).toFixed(4)
          ),
          type: CurrencyEnum.BTC,
        },
        rateInBTC: Number(
          Number(
            Number(
              SatoshiToBtcConverter(value.offerDetailsInJson.satoshisToReceive)
            ) /
              Number(
                ethers.utils.formatEther(value.offerDetailsInJson.offerQuantity)
              )
          ).toFixed(4)
        ),
        date: TimeToDateFormat(value.offerDetailsInJson.orderedTime), //"09 Jan, 13:45pm",
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
                "Planning to sell",
                "Planning to buy",
                "Price per ETH in BTC",
                "Progress",
                "Actions",
              ]}
              data={OngoingTableData2}
              handleSubmitPaymentProof={handleSubmitPaymentProof}
              mySwapOngoingLoadingText={mySwapOngoingLoadingText}
              contract={contract}
            />
          </div>
          <div className={styles.recentMobileTable}>
            <RecentOngoingTable
              tableCaption="Ongoing"
              cols={["Sell", "Buy", "Progress", ""]}
              data={OngoingTableData}
              mobile={true}
              handleSubmitPaymentProof={handleSubmitPaymentProof}
              mySwapOngoingLoadingText={mySwapOngoingLoadingText}
              contract={contract}
            />
          </div>
          <br />
          <Center>
            {mySwapOngoingLoadingText != "" ? (
              <ActionButton
                variant={"transparent"}
                loading={isMoreMySwapOngoinTableDataLoading}
              >
                {mySwapOngoingLoadingText}
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
          rowFullFillmentQuantityRequested={rowFullFillmentQuantityRequested}
          key={exchangeOfferDrawerKey}
        />
      </GradientBackgroundContainer>
      {/* Star My Swap History */}
      <GradientBackgroundContainer colorLeft="#FFD57243">
        <Box p={"lg"} className={styles.box}>
          <div className={styles.historyTable}>
            <RecentHistoryTable
              tableCaption="History"
              cols={[
                "# of order",
                "Planning to sell",
                "Planning to buy",
                "Price per ETH in BTC",
                "Date",
                "Status",
              ]}
              data={HistoryTableData2}
            />
          </div>
          <div className={styles.mobileHistoryTable}>
            <RecentHistoryTable
              tableCaption="History"
              cols={["# of order", "Date", "More Details"]}
              mobile={true}
              data={HistoryTableData}
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
      {/* End My Swap History */}
    </div>
  );
}

function AllSwaps() {
  const { mobileView } = useWindowDimensions();
  const [isMoreSwapsLoading, setMoreSwapsLoading] = useState(false);
  const [swapData, setSwapData] = useState(HistoryTableData);
  const loadMoreSwaps = () => {
    setMoreSwapsLoading(true);
    setTimeout(() => {
      setSwapData([...swapData, ...HistoryTableData]);
      setMoreSwapsLoading(false);
    }, 2000);
  };
  return (
    <GradientBackgroundContainer colorLeft="#FFD57243">
      <Box p={"lg"} className={styles.box}>
        <AllSwapTable
          data={swapData}
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
          <ActionButton
            variant={"transparent"}
            loading={isMoreSwapsLoading}
            onClick={loadMoreSwaps}
          >
            Load more
          </ActionButton>{" "}
        </Center>
      </Box>
    </GradientBackgroundContainer>
  );
}
