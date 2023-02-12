import { ReactNode } from "react";
import styles from "./Tabs.module.scss";
import { Tabs as MantineTabs } from "@mantine/core";
interface Props {
  tabs: { value: string; label: string | ReactNode }[];
  panels: { value: string; children: ReactNode }[];
  defaultValue?: string;
}

const Tabs = ({ tabs, panels, defaultValue, ...props }: Props) => {
  return (
    <MantineTabs
      variant="outline"
      classNames={styles}
      defaultValue={defaultValue || tabs[0].value}
      {...props}
    >
      <MantineTabs.List>
        {tabs.map((tab, index) => (
          <MantineTabs.Tab key={index} value={tab.value}>
            {tab.label}
          </MantineTabs.Tab>
        ))}
      </MantineTabs.List>

      {panels.map((panel) => (
        <MantineTabs.Panel value={panel.value} key={panel.value}>
          {panel.children}
        </MantineTabs.Panel>
      ))}
    </MantineTabs>
  );
};

export default Tabs;
