import React from "react";
import { Icon } from "@iconify/react";
import styles from "./Sidebar.module.scss";
type Props = {};

const Sidebar = (props: Props) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.navList}>
        <NavItem icon="ic:round-home" />
        <NavItem icon="ic:twotone-currency-exchange" />
        <NavItem icon="ic:baseline-history" />
        <NavItem icon="bxs:dollar-circle" />
      </div>
    </aside>
  );
};

export default Sidebar;

function NavItem({ icon }: { icon: string }) {
  return (
    <span className={styles.navItem}>
      <Icon icon={icon} className={styles.icon} />
    </span>
  );
}
