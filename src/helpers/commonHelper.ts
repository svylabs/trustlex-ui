import { ERC20TokenLabel } from "~/Context/Constants";

export function getStringForTx(
  tx: string,
  fisrtN: number = 4,
  lastN: number = 4
) {
  if (tx && tx.length >= fisrtN + lastN) {
    let fisrtNChars = tx.slice(0, 5);
    let lastNchars = tx.slice(-5);
    let resultString = `${fisrtNChars}...${lastNchars}`;
    return resultString;
  } else {
    return tx;
  }
}

export async function ConvertCrytoToFiat(
  selectedToken_to_usd_rate: number,
  crypto_amount: number,
  to: string = "usd"
) {
  let rate = selectedToken_to_usd_rate;

  let usd_amount: any = crypto_amount * rate;
  // console.log(usd_amount);
  let return_amount = convertAmountNumberToHumanReadableFormat(usd_amount);
  return return_amount;
}

export function convertAmountNumberToHumanReadableFormat(labelValue: string) {
  // Nine Zeroes for Billions
  let result: any =
    Math.abs(Number(labelValue)) >= 1.0e9
      ? Math.ceil(Math.abs(Number(labelValue)) / 1.0e9) + " Billion"
      : // Six Zeroes for Millions
      Math.abs(Number(labelValue)) >= 1.0e6
      ? Math.ceil(Math.abs(Number(labelValue)) / 1.0e6) + " Million"
      : // Three Zeroes for Thousands
      Math.abs(Number(labelValue)) >= 1.0e3
      ? Math.ceil(Math.abs(Number(labelValue)) / 1.0e3) + " Thousands"
      : Math.ceil(Math.abs(Number(labelValue)));
  return result;
}
