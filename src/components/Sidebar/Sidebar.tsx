import React from "react";
import { Icon } from "@iconify/react";
import styles from "./Sidebar.module.scss";
import { NavLink } from "react-router-dom";
import { clsx, Tooltip } from "@mantine/core";
import { INavItem } from "~/interfaces/INavItem";
import BrandLogo from "~/components/BrandLogo/BrandLogo";
type Props = {};

const Sidebar = (props: Props) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.navList}>
        <BrandLogo />
        <NavItem icon="ic:round-home" to="/" title="Home" />
        <NavItem
          icon="ic:twotone-currency-exchange"
          to="/exchange"
          title="Exchange"
        />
        <NavItem icon="ic:baseline-history" to="/history" title="History" />
        <NavItem icon="bxs:dollar-circle" to="/earn" title="Earn" />
      </div>
    </aside>
  );
};

export default Sidebar;

function NavItem({ icon, to, title }: INavItem) {
  return (
    <Tooltip label={title}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive ? clsx(styles.active, styles.navLink) : styles.navLink
        }
      >
        <span className={styles.navItem}>
          <Icon icon={icon} className={styles.icon} />
        </span>
      </NavLink>
    </Tooltip>
  );
}
