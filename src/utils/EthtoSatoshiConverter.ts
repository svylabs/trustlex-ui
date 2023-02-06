const EthtoSatoshiConverter = (eth: string | number) => {
  if (typeof eth === "string") {
    eth = Number(eth);
  }

  return (eth * 7170255).toFixed(0);
};

export default EthtoSatoshiConverter;
