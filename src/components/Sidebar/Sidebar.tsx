import styles from "./Sidebar.module.scss";
import { NavLink } from "react-router-dom";
import { Avatar, clsx, Image } from "@mantine/core";
import { INavItem } from "~/interfaces/INavItem";
import BrandLogo from "~/components/BrandLogo/BrandLogo";
type Props = {};

const Sidebar = (props: Props) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.navList}>
        <div className={styles.brandLogo}>
          <BrandLogo />
        </div>

        <NavItem icon={"/icons/Home.png"} to="/">
          Home
        </NavItem>
        <NavItem icon={"/icons/exchange.png"} to="/exchange">
          Exchange
        </NavItem>
        <NavItem icon={"/icons/recent.png"} to="/history">
          History
        </NavItem>
        <NavItem icon={"/icons/earn.png"} to="/earn">
          Earn
        </NavItem>

        <div className={styles.sidebarUser}>
          <Avatar src="/images/user.png" className={styles.avatar} />
          <div className={styles.userDetails}>
            <b className={styles.userFullName}>Dmytro H.</b>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

function NavItem({ icon, to, children }: INavItem) {
  return (
    <div className={styles.navItem}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive ? clsx(styles.active, styles.navLink) : styles.navLink
        }
      >
        <Image alt={children} src={icon} className={styles.icon} />
        <span className={styles.navItem}>{children}</span>
      </NavLink>
    </div>
  );
}
