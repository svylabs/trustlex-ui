import React from "react";
import { Grid } from "@mantine/core";
import Sidebar from "~/components/Sidebar/Sidebar";
import styles from "./Layout.module.scss";
import { Outlet } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid className={styles.layout}>
      <Grid.Col span={"content"}>
        <Sidebar />
      </Grid.Col>
      <Grid.Col span={11}>{children}</Grid.Col>
    </Grid>
  );
};

export default Layout;
