export interface ISendBtcBoxProps {
  open: boolean;
  onClose: () => void;
  myBTCWalletDrawerOpen: boolean;
  setMyBTCWalletDrawerOpen: (myBTCWalletDrawerOpen: boolean) => void;
  myWalletDrawerhandleClose: () => void;
  handleMyWallet: () => void;
}
