import React from "react";
import { Grid } from "@mantine/core";
import Sidebar from "~/components/Sidebar/Sidebar";
import styles from "./Layout.module.scss";
type Props = {};

const Layout = (props: Props) => {
  return (
    <Grid className={styles.layout}>
      <Grid.Col span={"content"}>
        <Sidebar />
      </Grid.Col>
      <Grid.Col span={11}>10</Grid.Col>
    </Grid>
  );
};

export default Layout;
