import React from "react";
import { Grid, Stack } from "@mantine/core";
import Sidebar from "~/components/Sidebar/Sidebar";
import styles from "./Layout.module.scss";
import Navbar from "~/components/Navbar/Navbar";
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid className={styles.layout} gutter={0}>
      <Grid.Col span={"content"}>
        <Sidebar />
      </Grid.Col>
      <Grid.Col span={"auto"}>
        <Stack>
          <Navbar />
          <main className={styles.content}>{children}</main>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default Layout;
