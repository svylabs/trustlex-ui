import React from "react";
import { IListenedOfferData } from "~/interfaces/IOfferdata";
import SatoshiToBtcConverter from "~/utils/SatoshiToBtcConverter";
import { ethers } from "ethers";
import ImageIcon from "~/components/ImageIcon/ImageIcon";
import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import {
  NumberToTime,
  TimeToNumber,
  TimeToDateFormat,
} from "~/utils/TimeConverter";
import { AppContext } from "~/Context/AppContext";
import { tofixedEther } from "~/utils/Ether.utills";
import { IFullfillmentResult } from "~/interfaces/IOfferdata";
import { getInitializedFulfillmentsByOfferId } from "~/service/AppService";
import { tofixedBTC } from "~/utils/BitcoinUtils";
import { BTC_DECIMAL_PLACE } from "~/Context/Constants";
import { currencyObjects } from "~/Context/Constants";

const getTableData = (
  offers: IListenedOfferData[],
  selectedToken: string = "ETH",
  selectedNetwork: string
) => {
  let selectedCurrencyIcon =
    currencyObjects[selectedNetwork][selectedToken.toLowerCase()]?.icon;
  return offers
    .filter(function (offer: IListenedOfferData) {
      console.log(offer.offerDetailsInJson);
      let satoshisToReceive = +offer.offerDetailsInJson.satoshisToReceive;
      let satoshisReserved = +offer.offerDetailsInJson.satoshisReserved;
      let satoshisReceived = +offer.offerDetailsInJson.satoshisReceived;
      let isCanceled = offer.offerDetailsInJson.isCanceled;

      // let left_to_buy = satoshisToReceive - (satoshisReceived + satoshisReserved);
      let left_to_buy = satoshisToReceive - satoshisReceived;
      console.log(left_to_buy);
      // add OR condition in if , if any fullfillment of that offer is in progress
      if (left_to_buy === 0 || isCanceled == true) {
        return false; // skip
      }
      return true;
    })
    .map((offer: IListenedOfferData) => {
      // console.log(offer);
      let planningToSell = Number(
        SatoshiToBtcConverter(offer.offerDetailsInJson.satoshisToReceive)
      );
      planningToSell = tofixedBTC(planningToSell);

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
      let satoshisReserved = Number(offer.offerDetailsInJson.satoshisReserved);
      // console.log(satoshisReserved);
      const satoshisReceived = Number(
        offer.offerDetailsInJson.satoshisReceived
      );

      // update satoshisReserved amount
      // if (satoshisToReceive == satoshisReserved + satoshisReceived) {
      let fullfillmentResults = offer.offerDetailsInJson.fullfillmentResults;

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
      // }
      // console.log(satoshisReserved);
      let left_to_buy =
        Number(
          SatoshiToBtcConverter(
            satoshisToReceive - (satoshisReserved + satoshisReceived)
          )
        ) / price_per_ETH_in_BTC;
      left_to_buy = tofixedEther(left_to_buy);
      return [
        // offer.offerDetailsInJson.offeredBlockNumber,
        // offer.offerEvent.to.toString(),
        offer.offerDetailsInJson.offerId,
        <>
          {offerQuantity} {selectedCurrencyIcon} {selectedToken}
          {/* <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.ETH)} />
          {CurrencyEnum.ETH} */}
        </>,
        <>
          {planningToSell}{" "}
          <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.BTC)} />{" "}
          {CurrencyEnum.BTC}
        </>,
        <>
          {price_per_ETH_in_BTC.toFixed(BTC_DECIMAL_PLACE)}{" "}
          <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.BTC)} />{" "}
          {CurrencyEnum.BTC}
        </>,
        <>
          {left_to_buy} {selectedCurrencyIcon} {selectedToken}
          {/* <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.ETH)} />
          {CurrencyEnum.ETH} */}
        </>,
        // NumberToTime(offer.offerDetailsInJson.offerValidTill+offer.offerDetailsInJson.orderedTime),
        TimeToDateFormat(
          (
            parseInt(offer.offerDetailsInJson.offerValidTill) +
            parseInt(offer.offerDetailsInJson.orderedTime)
          ).toString()
        ),
        TimeToDateFormat(offer.offerDetailsInJson.orderedTime),
      ];
    });
};
export default getTableData;
