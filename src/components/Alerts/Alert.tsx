import React, { ReactNode } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Group, useMantineTheme } from "@mantine/core";
import { Text, Paper } from "@mantine/core";
import { useEffect } from "react";

interface props {
  message: string | ReactNode;
  isOpened: boolean;
  setAlertMessage: (message: string) => void;
  setAlertOpen: (isOpened: boolean) => void;
}

function Alert({ message, isOpened, setAlertMessage, setAlertOpen }: props) {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  useEffect(() => {
    if (isOpened) {
      open();
    }
  }, [isOpened]);
  const handleOpen = () => {
    open();
  };
  const handleClose = () => {
    close();
    setAlertOpen(false);
    setAlertMessage("");
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={"Alert"}
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
          <Text fw={500}>{message}</Text>
          <div style={{ marginTop: "20px", float: "right" }}>
            <Button
              variant="outline"
              radius={5}
              onClick={close}
              color="red.5"
              style={{
                backgroundColor: "transparent",
              }}
            >
              OK
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

export default Alert;
