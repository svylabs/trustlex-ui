import React from "react";
import { Grid, Stack } from "@mantine/core";
import Sidebar from "~/components/Sidebar/Sidebar";
import styles from "./Layout.module.scss";
import Navbar from "~/components/Navbar/Navbar";
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.main}>
        <Stack>
          <Navbar />
          <main className={styles.content}>{children}</main>
        </Stack>
      </div>
    </div>
  );
};

export default Layout;
