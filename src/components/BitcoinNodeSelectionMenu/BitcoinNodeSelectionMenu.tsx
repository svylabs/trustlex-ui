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

function BitcoinNodeSelectionMenu() {
  const { mobileView } = useWindowDimensions();

  let icon = "/icons/bitcoin.svg";
  let title = mobileView ? "" : "Bitcoin";
  return (
    <div className={styles.root}>
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
          <Menu.Item>
            Trustlex Node{" "}
            <ThemeIcon
              size="md"
              variant="gradient"
              gradient={{ from: "teal", to: "lime" }}
            >
              <IconCheck size="1.8rem" />
            </ThemeIcon>
          </Menu.Item>
          <Menu.Item
            component={() => {
              return Demo();
            }}
          />
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
