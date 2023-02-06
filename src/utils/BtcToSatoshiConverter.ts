const BtcToSatoshiConverter = (btc: string | number) => {
  if (typeof btc === "string") {
    btc = Number(btc);
  }
  return (btc * 100000000).toFixed(0);
};

export default BtcToSatoshiConverter;
