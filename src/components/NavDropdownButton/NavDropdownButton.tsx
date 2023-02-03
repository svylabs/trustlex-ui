import { Icon } from "@iconify/react";
import { Menu } from "@mantine/core";
import styles from "./NavDropdownButton.module.scss";
import navDropdownStyles from "./NavDropdownStyles.module.scss";

interface INavDropdown {
  icon: string;
  title: string;
  dropdownItems: { title: string; href: string; onClick?: () => void }[];
}

const NavDropdownButton = ({ icon, title, dropdownItems }: INavDropdown) => {
  return (
    <div className={styles.root}>
      <Menu classNames={navDropdownStyles}>
        <Menu.Target>
          <div className={styles.navButton}>
            <img src={icon} className={styles.icon} />
            <span className={styles.title}>{title}</span>
            <Icon
              icon={"ic:round-keyboard-arrow-down"}
              className={styles.chevronIcon}
            />
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          {dropdownItems.map((item, index) => (
            <Menu.Item key={index} onClick={item.onClick}>
              {item.title}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default NavDropdownButton;
