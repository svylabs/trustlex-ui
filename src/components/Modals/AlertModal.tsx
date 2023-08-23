import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { Modal, Button, Group } from "@mantine/core";

import React, { ReactNode } from "react";
import { useMantineTheme } from "@mantine/core";
import { Text, Paper } from "@mantine/core";

interface props {
  isOpened: number;
  setIsOpened: (isOpened: number) => void;
  title: string;
  setAlertModalTitle: (title: string) => void;
  content: string;
  setAlertModalContent: (content: string) => void;
}
const AlertModal = function ({
  isOpened,
  setIsOpened,
  title,
  content,
  setAlertModalTitle,
  setAlertModalContent,
}: props) {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  useEffect(() => {
    if (isOpened !== 0) {
      open();
    } else {
      close();
      setIsOpened(0);
    }
  }, [isOpened]);
  const handleOpen = () => {
    open();
  };
  const handleClose = () => {
    setIsOpened(0);
    setAlertModalTitle("");
    setAlertModalContent("");
  };

  return (
    <>
      <Modal
        withCloseButton={true} // to show the close option make it withCloseButton =  true
        opened={opened}
        onClose={handleClose}
        title={title}
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
          <Text fw={500}>{content}</Text>
          <div style={{ marginTop: "20px", float: "right" }}>
            <Button
              variant="outline"
              radius={5}
              onClick={handleClose}
              color="red.5"
              style={{
                backgroundColor: "transparent",
              }}
            >
              Close
            </Button>
          </div>
        </Paper>
      </Modal>

      {/* <Group position="center">
        <Button onClick={open}>Open modal</Button>
      </Group> */}
    </>
  );
};

export default AlertModal;
