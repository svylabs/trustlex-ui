const getEthereumObject = () => window.ethereum;

export const findMetaMaskAccount = async () => {
  try {
    const ethereum = await getEthereumObject();
    if (!ethereum) {
      console.log("Make sure you have metamask");
      return false;
    }
    console.log("We have the ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account", account);
      return account;
    } else {
      console.error("No authorized account found");
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const connectToMetamask = async () => {
  try {
    const ethereum = getEthereumObject();
    if (!ethereum) {
      alert("Get MetaMast!");
      return false;
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    console.log("Connected", accounts[0]);
    return accounts[0];
  } catch (error) {
    console.log(error);
    return false;
  }
};
