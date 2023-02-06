const SatoshiToEthConverter = (satoshi: string | number) => {
  if (typeof satoshi === "string") {
    satoshi = Number(satoshi);
  }

  return (satoshi / 7170255).toFixed(8);
};

export default SatoshiToEthConverter;
