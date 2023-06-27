const { BitcoinCoreClient } = window;

const client = new BitcoinCoreClient({
  network: "regtest",
  username: "admin",
  password:
    "54dbafeb6d6cfe0547232588add8929e$5f87b341887b15ebc8dc6bae3727191eede833578df877bc1757666e7356901f",
  port: 18443,
  host: "134.209.22.120",
  headers: true,
});

export class RPCClient {
  static listWalletDir() {
    return new Promise((resolve, reject) => {
      client
        .listWalletDir()
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  static listWallets() {
    return new Promise((resolve, reject) => {
      client
        .listWallets()
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  static getNewAddress() {
    return new Promise((resolve, reject) => {
      client
        .getNewAddress()
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  static generateToAddress(blockCount: number, address: string) {
    return new Promise((resolve, reject) => {
      client
        .generateToAddress(blockCount, address)
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  static getBalance() {
    return new Promise((resolve, reject) => {
      client
        .getBalance()
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  static sendToAddress(address: string, amount: number) {
    return new Promise((resolve, reject) => {
      client
        .sendToAddress(address, amount)
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  static getBlock(hash: string) {
    return client.getBlock(hash);
  }
  static getBlockHeader(hash: string) {
    return client.getBlockHeader(hash);
  }
  static getRawBlockHeader(hash: string) {
    return client.getBlockHeader(hash, false);
  }
  static getBestBlockHash() {
    return client.getBestBlockHash();
  }
  static getTransaction(hash: string) {
    return client.getTransaction(hash);
  }
  static createWallet(name: string) {
    return client.createWallet(name);
  }
  static sendRawTransaction(rawtx: string) {
    return client.sendRawTransaction(rawtx);
  }
}
