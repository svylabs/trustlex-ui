import { ReactNode, useEffect, useRef, useState, useContext } from "react";
import styles from "./CopyToClipboard.module.scss";
import { Tooltip } from "@mantine/core";
import { ActionIcon } from "@mantine/core";

import {
  IconAdjustments,
  IconClipboardCopy,
  IconClipboardCheck,
  IconCopy,
} from "@tabler/icons-react";

interface props {
  text: string;
}

const CopyToClipboard = ({ text }: props) => {
  const [clipboardTxCopy, setClipboardTxCopy] = useState(false);
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setClipboardTxCopy(true);
    setTimeout(function () {
      setClipboardTxCopy(false);
    }, 2000);
  };

  return (
    <span
      className={styles.iconBox}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
      }}
    >
      <Tooltip
        label={clipboardTxCopy == true ? "Copied" : "Copy"}
        color={clipboardTxCopy == true ? "green" : "dark"}
        withArrow
      >
        <ActionIcon
          size="md"
          radius="md"
          variant="transparent"
          onClick={() => {
            handleCopyText(`${text}`);
          }}
        >
          {clipboardTxCopy == true ? (
            <>
              <IconClipboardCheck
                size="1.625rem"
                className={styles.icon}
                color="green"
              />
            </>
          ) : (
            <>
              <IconClipboardCopy size="1.625rem" className={styles.icon} />
            </>
          )}
        </ActionIcon>
      </Tooltip>
    </span>
  );
};

export default CopyToClipboard;
