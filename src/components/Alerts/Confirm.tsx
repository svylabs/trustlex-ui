import React, { ReactNode } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Group, useMantineTheme } from "@mantine/core";
import { Text, Paper } from "@mantine/core";
import { useEffect } from "react";

interface props {
  confirmBoxMessage: string | JSX.Element;
  confirmBoxOpen: number;
  handleInstantWalletDownloadContinueAnyway: () => void;
}

export function DownloadInstantWalletConfirm({
  confirmBoxMessage,
  confirmBoxOpen,
  handleInstantWalletDownloadContinueAnyway,
}: props) {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  useEffect(() => {
    console.log(confirmBoxOpen);
    if (confirmBoxOpen != 0) {
      open();
    } else {
      close();
    }
  }, [confirmBoxOpen]);

  const handleOpen = () => {
    open();
  };
  const handleClose = () => {
    close();
  };

  return (
    <>
      <Modal
        // withCloseButton={false}
        opened={opened}
        onClose={close}
        title={"Confirm"}
        centered
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <Paper shadow="xs" p="md">
          <Text fw={500}>{confirmBoxMessage}</Text>
          <div style={{ marginTop: "20px", float: "right" }}>
            <Button
              variant="outline"
              radius={5}
              onClick={handleInstantWalletDownloadContinueAnyway}
              color="red.5"
              style={{
                backgroundColor: "transparent",
                marginRight: "10px",
              }}
            >
              Continue Anyway
            </Button>
            <Button
              variant="outline"
              radius={5}
              onClick={handleClose}
              color="green.5"
              style={{
                backgroundColor: "transparent",
              }}
            >
              Back
            </Button>
          </div>
        </Paper>
      </Modal>

      {/* <Group position="center">
        <Button onClick={handleOpen}>Open modal</Button>
      </Group> */}
    </>
  );
}
