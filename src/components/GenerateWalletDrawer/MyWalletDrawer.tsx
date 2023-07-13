import { Drawer, Grid, Text, Dialog } from "@mantine/core";
import GradientBackgroundContainer from "~/components/GradientBackgroundContainer/GradientBackgroundContainer";
import styles from "~/components/GenerateWalletDrawer/MyWalletDrawer.module.scss";
import Button from "~/components/Button/Button";
import { VariantsEnum } from "~/enums/VariantsEnum";
import { Icon } from "@iconify/react";
import Tabs from "~/components/Tabs/Tabs";
import InstantWalletWithGenerateButton from "~/components/GenerateWalletDrawer/InstantWalletWithGenerateButton/InstantWalletWithGenerateButton";
import HardwareWallet from "~/components/GenerateWalletDrawer/HardwareWallet/HardwareWallet";
import ImportWallet from "~/components/GenerateWalletDrawer/ImportWallet/ImportWallet";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
import useAutoHideScrollbar from "~/hooks/useAutoHideScrollBar";
import { useEffect, useRef, useState } from "react";
import useDetectOutsideClick from "~/hooks/useDetectOutsideClick";
import { Wallet, generateTrustlexAddress } from "~/utils/BitcoinUtils";
import { PaperWalletDownloadedEnum } from "~/interfaces/IExchannge";
import { DownloadInstantWalletConfirm } from "~/components/Alerts/Confirm";
import { IBTCWallet } from "~/utils/BitcoinUtils";

interface IProps {
  open: boolean;
  onClose: () => void;
  setPaperWalletDownloaded: (
    paperWalletDownloaded: PaperWalletDownloadedEnum
  ) => void;
  paperWalletDownloaded: PaperWalletDownloadedEnum;
  setMyBTCWalletDrawerOpen: (open: boolean) => void;
  btcWalletData: IBTCWallet | undefined;
  setBTCWalletData: (btcWalletData: IBTCWallet | undefined) => void;
}

const MyWalletDrawer = ({
  open,
  onClose,
  setPaperWalletDownloaded,
  paperWalletDownloaded,
  setMyBTCWalletDrawerOpen,
  btcWalletData,
  setBTCWalletData,
}: IProps) => {
  const { mobileView, tabletView } = useWindowDimensions();

  const [confirmBoxMessage, setConfirmBoxMessage] = useState<
    string | JSX.Element
  >("");
  const [confirmBoxOpen, setConfirmBoxOpen] = useState<number>(0);

  const mobileContentRef = useRef(null);

  const handleDrawerClose = () => {
    if (paperWalletDownloaded == PaperWalletDownloadedEnum.Generated) {
      setConfirmBoxOpen(confirmBoxOpen + 1);
      setConfirmBoxMessage(
        "Kindly Download the wallet file. Otherwise you will not able to receive the offer payment!"
      );
      // onClose();
      // setMyBTCWalletDrawerOpen(false);
    } else {
      setMyBTCWalletDrawerOpen(false);
      setConfirmBoxMessage("");
      setConfirmBoxOpen(0);
    }
  };

  const handleInstantWalletDownloadContinueAnyway = () => {
    setPaperWalletDownloaded(PaperWalletDownloadedEnum.Downloaded);
    setMyBTCWalletDrawerOpen(false);
    setConfirmBoxMessage("");
    setConfirmBoxOpen(0);
  };

  useDetectOutsideClick({
    ref: mobileContentRef,
    callback: handleDrawerClose,
  });

  if (!open) return null;
  // if (!data) return onClose();
  return (
    <>
      {mobileView ? (
        open ? (
          <div className={styles.mobileDialogRoot}>
            <div className={styles.mobileDialogContent} ref={mobileContentRef}>
              <GradientBackgroundContainer
                radius={10}
                colorLeft={"#FEBD3893"}
                bgImage="/images/Rectangle.svg"
              >
                <GenerateWalletContent
                  onClose={handleDrawerClose}
                  confirmBoxMessage={confirmBoxMessage}
                  confirmBoxOpen={confirmBoxOpen}
                  handleInstantWalletDownloadContinueAnyway={
                    handleInstantWalletDownloadContinueAnyway
                  }
                  btcWalletData={btcWalletData}
                  setBTCWalletData={setBTCWalletData}
                />
              </GradientBackgroundContainer>
            </div>
          </div>
        ) : null
      ) : (
        <Drawer
          opened={open}
          onClose={handleDrawerClose}
          position="right"
          overlayBlur={2.5}
          overlayOpacity={0.5}
          withCloseButton={false}
          size={tabletView ? 500 : 600}
          closeOnClickOutside={true}
          closeOnEscape={true}
        >
          <GradientBackgroundContainer
            radius={0}
            colorLeft={"#FEBD3893"}
            bgImage="/images/Rectangle.svg"
          >
            <GenerateWalletContent
              onClose={handleDrawerClose}
              confirmBoxMessage={confirmBoxMessage}
              confirmBoxOpen={confirmBoxOpen}
              handleInstantWalletDownloadContinueAnyway={
                handleInstantWalletDownloadContinueAnyway
              }
              btcWalletData={btcWalletData}
              setBTCWalletData={setBTCWalletData}
            />
          </GradientBackgroundContainer>
        </Drawer>
      )}
    </>
  );
};

const GenerateWalletContent = ({
  onClose,
  confirmBoxMessage,
  confirmBoxOpen,
  handleInstantWalletDownloadContinueAnyway,
  btcWalletData,
  setBTCWalletData,
}: {
  onClose: () => void;
  confirmBoxMessage: string | JSX.Element;
  confirmBoxOpen: number;
  handleInstantWalletDownloadContinueAnyway: () => void;
  btcWalletData: IBTCWallet | undefined;
  setBTCWalletData: (btcWalletData: IBTCWallet | undefined) => void;
}) => {
  const { mobileView } = useWindowDimensions();
  const generateWalletRef = useRef(null);
  useAutoHideScrollbar(generateWalletRef);

  const handleResetWallet = () => {
    setBTCWalletData(undefined);
    localStorage.removeItem("btcWalletData");
  };

  return (
    <div className={styles.generateWalletRoot} ref={generateWalletRef}>
      <DownloadInstantWalletConfirm
        confirmBoxMessage={confirmBoxMessage}
        confirmBoxOpen={confirmBoxOpen}
        handleInstantWalletDownloadContinueAnyway={
          handleInstantWalletDownloadContinueAnyway
        }
      />
      {mobileView ? (
        <Grid className={styles.heading}>
          <Grid.Col className={styles.crossIconBox} py={0}>
            <Button variant={VariantsEnum.default} onClick={onClose} p={0}>
              <Icon icon="radix-icons:cross-2" className={styles.closeIcon} />
            </Button>
          </Grid.Col>
          <Grid.Col span={12} pt={0}>
            <Text component="h1" className={styles.headTitle}>
              Generating Address
            </Text>
          </Grid.Col>
        </Grid>
      ) : (
        <Grid className={styles.heading}>
          <Grid.Col span={11}>
            <Text component="h1" className={styles.headTitle}>
              My Wallet
            </Text>
          </Grid.Col>

          <Grid.Col span={1}>
            <Button variant={VariantsEnum.default} onClick={onClose} p={0}>
              <Icon
                icon="radix-icons:cross-circled"
                className={styles.closeIcon}
              />
            </Button>
          </Grid.Col>
        </Grid>
      )}
      {btcWalletData !== undefined ? (
        <>
          <div className={styles.instantWalletRoot}>
            <div className={styles.generatedAddress}>
              <h3> BTC Address:</h3>
              <p>
                {generateTrustlexAddress(
                  Buffer.from(btcWalletData.pubkeyHash, "hex"),
                  "10"
                )}
              </p>
            </div>

            <div className={styles.generatedAddress}>
              <h3> PublicKey:</h3>
              <p>{btcWalletData.publicKey}</p>
            </div>
            <div className={styles.generatedAddress}>
              <h3> PubKeyHash:</h3>
              <p>{btcWalletData.pubkeyHash}</p>
            </div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <Button
              variant={VariantsEnum.outlinePrimary}
              style={{ background: "transparent" }}
              radius={10}
              onClick={handleResetWallet}
            >
              Reset Wallet
            </Button>
          </div>
        </>
      ) : (
        <>
          <Tabs
            tabs={[
              { label: "Import wallet", value: "import-wallet" },
              { label: "Instant wallet", value: "instant-wallet" },
              { label: "Hardware wallet", value: "hardware-wallet" },
            ]}
            panels={[
              {
                value: "import-wallet",
                children: (
                  <ImportWallet
                    btcWalletData={btcWalletData}
                    setBTCWalletData={setBTCWalletData}
                  />
                ),
              },
              {
                value: "instant-wallet",
                children: (
                  <InstantWalletWithGenerateButton
                    btcWalletData={btcWalletData}
                    setBTCWalletData={setBTCWalletData}
                  />
                ),
              },
              {
                value: "hardware-wallet",
                children: <HardwareWallet />,
              },
            ]}
          />
        </>
      )}
    </div>
  );
};

export default MyWalletDrawer;
