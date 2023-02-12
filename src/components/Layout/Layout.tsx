import React from "react";
import Sidebar from "~/components/Sidebar/Sidebar";
import styles from "./Layout.module.scss";
import Navbar from "~/components/Navbar/Navbar";
import useDetectOutsideClick from "~/hooks/useDetectOutsideClick";
const Layout = ({ children }: { children: React.ReactNode }) => {
  const mobileSidebarRef = React.useRef(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useDetectOutsideClick({
    ref: mobileSidebarRef,
    callback: () => setSidebarOpen(false),
  });

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      {sidebarOpen && (
        <div className={styles.mobileSidebarContainer}>
          <div className={styles.mobileSidebar} ref={mobileSidebarRef}>
            <Sidebar />
          </div>
        </div>
      )}
      <div className={styles.main}>
        <Navbar toggleSidebar={toggleSidebar} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
