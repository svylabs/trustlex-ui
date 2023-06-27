import { useState, useEffect } from "react";
import { Menu, Button } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import { IconCheck } from "@tabler/icons-react";
import { Icon } from "@iconify/react";
import styles from "./BitcoinNodeSelectionMenu.module.scss";
import navDropdownStyles from "~/components/NavDropdownButton/NavDropdownStyles.module.scss";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
import { Badge } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { ThemeIcon } from "@mantine/core";
import Input from "../Input/Input";
import { BitcoinNodeEnum } from "~/interfaces/IBitcoinNode";
import CustomBitcoinNodeModal from "~/components/Modals/CustomBitcoinNodeModal";
interface props {
  selectedBitcoinNode: string;
  setSelectedBitcoinNode: (selectedBitcoinNode: string) => void;
}
function BitcoinNodeSelectionMenu({
  setSelectedBitcoinNode,
  selectedBitcoinNode,
}: props) {
  const { mobileView } = useWindowDimensions();

  let icon = "/icons/bitcoin.svg";
  let title = mobileView ? "" : "Bitcoin";
  const [isOpened, setIsOpened] = useState(0);

  const handleBitcoinNodeChange = async (BitCoinNode: string) => {
    let selectedBitcoinNode_ = selectedBitcoinNode;

    if (BitCoinNode == BitcoinNodeEnum.TrustlexNode) {
      setSelectedBitcoinNode(BitcoinNodeEnum.TrustlexNode);
    } else if (BitCoinNode == BitcoinNodeEnum?.LocalNode) {
      console.log(selectedBitcoinNode_, BitcoinNodeEnum?.LocalNode);
      if (selectedBitcoinNode_ != BitCoinNode) {
        setIsOpened(isOpened + 1);
      }
      setSelectedBitcoinNode(BitcoinNodeEnum?.LocalNode);
    }
  };

  return (
    <div className={styles.root}>
      <CustomBitcoinNodeModal isOpened={isOpened} setIsOpened={setIsOpened} />
      <Menu classNames={navDropdownStyles}>
        <Menu.Target>
          {/* <Button>Toggle menu</Button> */}
          <div className={styles.navButton}>
            {icon && icon !== "" && <img src={icon} className={styles.icon} />}
            {title !== "" && <span className={styles.title}>{title}</span>}
            <Icon
              icon={"ic:round-keyboard-arrow-down"}
              className={styles.chevronIcon}
            />
          </div>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            onClick={() =>
              handleBitcoinNodeChange(BitcoinNodeEnum.TrustlexNode)
            }
          >
            {BitcoinNodeEnum.TrustlexNode}{" "}
            {selectedBitcoinNode == BitcoinNodeEnum.TrustlexNode ? (
              <>
                <ThemeIcon
                  size="md"
                  variant="gradient"
                  gradient={{ from: "teal", to: "lime" }}
                >
                  <IconCheck size="1.8rem" />
                </ThemeIcon>
              </>
            ) : (
              <></>
            )}
          </Menu.Item>
          {/* <Menu.Item
            component={() => {
              return Demo();
            }}
          /> */}

          {/* <Menu.Item
            onClick={() => handleBitcoinNodeChange(BitcoinNodeEnum?.LocalNode)}
          >
            {BitcoinNodeEnum?.LocalNode}{" "}
            {selectedBitcoinNode == BitcoinNodeEnum?.LocalNode ? (
              <>
                <ThemeIcon
                  size="md"
                  variant="gradient"
                  gradient={{ from: "teal", to: "lime" }}
                >
                  <IconCheck size="1.8rem" />
                </ThemeIcon>
              </>
            ) : (
              <></>
            )}
          </Menu.Item> */}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}

export default BitcoinNodeSelectionMenu;

function Demo() {
  let icon = "/icons/bitcoin.svg";
  let dropdownItems = [
    {
      title: "BTC RPC URL",
      href: "",
    },
    { title: " RPC Password", href: "" },
    { title: " RPC Username", href: "" },
  ];
  return (
    <div className={styles.root}>
      <Menu
        classNames={navDropdownStyles}
        position="left-start"
        trigger="hover"
      >
        <Menu.Target>
          <div className={styles.navButton}>
            <span className={styles.title}>{"Local Node"}</span>
            <Icon
              icon={"ic:round-keyboard-arrow-down"}
              className={styles.chevronIcon}
            />
          </div>
        </Menu.Target>
        {dropdownItems && dropdownItems.length > 0 && (
          <Menu.Dropdown>
            {dropdownItems.map((item, index) => (
              <Menu.Item key={index} rightSection={<></>}>
                {item.title}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        )}
      </Menu>
    </div>
  );
}
