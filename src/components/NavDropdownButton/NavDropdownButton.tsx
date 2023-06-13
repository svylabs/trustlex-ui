import { Icon } from "@iconify/react";
import { Menu } from "@mantine/core";
import styles from "./NavDropdownButton.module.scss";
import navDropdownStyles from "./NavDropdownStyles.module.scss";
interface INavDropdown {
  icon?: string;
  title: string;
  handleNavButtonClick?: () => void;
  dropdownItems?: {
    title: string;
    href: string;
    inputField?: React.ReactNode;
    onClick?: () => void;
  }[];
}

const NavDropdownButton = ({
  icon,
  title,
  dropdownItems,
  handleNavButtonClick,
}: INavDropdown) => {
  return (
    <div className={styles.root}>
      <Menu classNames={navDropdownStyles}>
        <Menu.Target>
          <div className={styles.navButton} onClick={handleNavButtonClick}>
            {icon && icon !== "" && <img src={icon} className={styles.icon} />}
            {title !== "" && <span className={styles.title}>{title}</span>}
            <Icon
              icon={"ic:round-keyboard-arrow-down"}
              className={styles.chevronIcon}
            />
          </div>
        </Menu.Target>

        {dropdownItems && dropdownItems.length > 0 && (
          <Menu.Dropdown>
            {dropdownItems.map((item, index) => (
              <Menu.Item
                key={index}
                onClick={() => {
                  item.onClick;
                }}
                rightSection={<></>}
              >
                {item.title}
                {item.inputField && item.inputField}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        )}
      </Menu>
    </div>
  );
};

export default NavDropdownButton;
