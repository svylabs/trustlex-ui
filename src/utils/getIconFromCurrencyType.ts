import React from "react";
import { CurrencyEnum } from "~/enums/CurrencyEnum";

type Props = {};

export function getIconFromCurrencyType(type: CurrencyEnum): string {
  switch (type) {
    case CurrencyEnum.BTC:
      return "/icons/bitcoin.svg";
    case CurrencyEnum.ETH:
      return "/icons/ethereum-2.svg";
  }
}
