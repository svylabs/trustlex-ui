import { Drawer, Grid, Text } from "@mantine/core";
import GradientBackgroundContainer from "~/components/GradientBackgroundContainer/GradientBackgroundContainer";
import styles from "~/components/GenerateWalletDrawer/GenerateWalletDrawer.module.scss";
import Button from "~/components/Button/Button";
import { VariantsEnum } from "~/enums/VariantsEnum";
import { Icon } from "@iconify/react";
import Tabs from "~/components/Tabs/Tabs";
import InstantWallet from "~/components/GenerateWalletDrawer/InstantWallet/InstantWallet";
import HardwareWallet from "~/components/GenerateWalletDrawer/HardwareWallet/HardwareWallet";
interface IProps {
  open: boolean;
  onClose: () => void;
}

const GenerateWalletDrawer = ({ open, onClose }: IProps) => {
  return (
    <Drawer
      opened={open}
      onClose={onClose}
      position={"right"}
      overlayBlur={2.5}
      overlayOpacity={0.5}
      withCloseButton={false}
      size={600}
      closeOnClickOutside={true}
      closeOnEscape={true}
    >
      <GradientBackgroundContainer
        radius={0}
        colorLeft={"#FEBD3893"}
        bgImage="/images/Rectangle.svg"
      >
        <div className={styles.generateWalletRoot}>
          <Grid className={styles.heading}>
            <Grid.Col span={11}>
              <Text component="h1" className={styles.headTitle}>
                Generating link in browser
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
          <Tabs
            tabs={[
              { label: "Instant wallet", value: "instant-wallet" },
              { label: "Hardware wallet", value: "hardware-wallet" },
            ]}
            panels={[
              {
                value: "instant-wallet",
                children: <InstantWallet />,
              },
              {
                value: "hardware-wallet",
                children: <HardwareWallet />,
              },
            ]}
          />
        </div>
      </GradientBackgroundContainer>
    </Drawer>
  );
};

export default GenerateWalletDrawer;
