const SatoshiToBtcConverter = (satoshi: string | number) => {
  if (typeof satoshi === "string") {
    satoshi = Number(satoshi);
  }

  return (satoshi / 100000000).toFixed(8);
};

export default SatoshiToBtcConverter;
