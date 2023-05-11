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
