import { ERC20TokenLabel } from "~/Context/Constants";

export function getStringForTx(
  tx: string,
  fisrtN: number = 4,
  lastN: number = 4
) {
  if (tx.length >= fisrtN + lastN) {
    let fisrtNChars = tx.slice(0, 5);
    let lastNchars = tx.slice(-5);
    let resultString = `${fisrtNChars}...${lastNchars}`;
    return resultString;
  } else {
    return tx;
  }
}

export async function ConvertCrytoToFiat(
  crypto_amount: number,
  from: string,
  to: string = "usd"
) {
  let eth_usd = 1916.77;
  let rate;

  if (from == ERC20TokenLabel) {
    rate = 1;
  } else {
    rate = eth_usd;
  }
  let usd_amount: any = crypto_amount * rate;
  // usd_amount = usd_amount.toFixed(2);
  let return_amount = convertAmountNumberToHumanReadableFormat(usd_amount);
  return return_amount;
}

export function convertAmountNumberToHumanReadableFormat(labelValue: string) {
  // Nine Zeroes for Billions
  let result: any =
    Math.abs(Number(labelValue)) >= 1.0e9
      ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + " Billion"
      : // Six Zeroes for Millions
      Math.abs(Number(labelValue)) >= 1.0e6
      ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + " Million"
      : // Three Zeroes for Thousands
      Math.abs(Number(labelValue)) >= 1.0e3
      ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + " Thousands"
      : Math.abs(Number(labelValue)).toFixed(2);
  return result;
}
