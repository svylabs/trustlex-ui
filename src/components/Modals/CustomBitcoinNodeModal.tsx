import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { Modal, Button, Group } from "@mantine/core";
interface props {
  isOpened: Number;
  setIsOpened: (isOpened: Number) => void;
}
const CustomBitcoinNodeModal = function ({ isOpened, setIsOpened }: props) {
  const [opened, { open, close }] = useDisclosure(false);
  useEffect(() => {
    if (isOpened !== 0) {
      open();
    } else {
      close();
      setIsOpened(0);
    }
  }, [isOpened]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Authentication">
        {/* Modal content */}
        Demo modal content
      </Modal>

      {/* <Group position="center">
        <Button onClick={open}>Open modal</Button>
      </Group> */}
    </>
  );
};

export default CustomBitcoinNodeModal;
