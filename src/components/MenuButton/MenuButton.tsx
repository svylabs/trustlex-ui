import { Menu } from "@mantine/core";
import React from "react";
import Button from "~/components/Button/Button";
import TargetButton from "../Button/TargetButton";

type Props = {
  children: React.ReactNode;
};

const MenuButton = ({ children }: Props) => {
  return (
    <Menu>
      <Menu.Target>
        <TargetButton>{children}</TargetButton>
      </Menu.Target>
      <Menu.Dropdown>
        {/* this will be implemented later on  */}
        {/* I'm skipping this part for now because  */}
        {/* currently i don't have screenshot of this part */}
      </Menu.Dropdown>
    </Menu>
  );
};

export default MenuButton;
