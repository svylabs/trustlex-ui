import { ISendBtcBoxProps } from "~/interfaces/ISendBtcProps";
import { Drawer, Grid, Text } from "@mantine/core";
import GradientBackgroundContainer from "~/components/GradientBackgroundContainer/GradientBackgroundContainer";
import styles from "~/components/SendBtc/SendBtcDrawer/SendBtcDrawer.module.scss";
import { VariantsEnum } from "~/enums/VariantsEnum";
import Button from "~/components/Button/Button";
import { Icon } from "@iconify/react";
import DrawerInput from "~/components/GenerateWalletDrawer/DrawerInput/DrawerInput";
const SendBtcDrawer = ({ open, onClose }: ISendBtcBoxProps) => {
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
        <div className={styles.sendBtcDrawerRoot}>
          <Grid className={styles.heading}>
            <Grid.Col span={11}>
              <Text component="h1" className={styles.headTitle}>
                Send BTC
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
          <div className={styles.inputAndButton}>
            <div className={styles.inputField}>
              <DrawerInput type="text" placeholder="Address to send BTC" />
            </div>
            <Button
              variant={VariantsEnum.outlinePrimary}
              radius={10}
              compact={false}
              style={{
                height: "43px",
                width: "167px",
                backgroundColor: "transparent",
              }}
              fullWidth
            >
              Send
            </Button>
          </div>
        </div>
      </GradientBackgroundContainer>
    </Drawer>
  );
};

export default SendBtcDrawer;
