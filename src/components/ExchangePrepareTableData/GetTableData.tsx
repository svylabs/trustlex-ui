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

const getTableData = (offers: IListenedOfferData[]) => {
  console.log(offers);
  return offers
    .filter(function (offer: IListenedOfferData) {
      let satoshisToReceive = +offer.offerDetailsInJson.satoshisToReceive;
      let satoshisReserved = +offer.offerDetailsInJson.satoshisReserved;
      let satoshisReceived = +offer.offerDetailsInJson.satoshisReceived;
      let left_to_buy = satoshisToReceive - satoshisReceived;
      if (left_to_buy === 0) {
        return false; // skip
      }
      return true;
    })
    .map((offer: IListenedOfferData) => {
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
export default getTableData;
