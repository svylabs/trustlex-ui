import React, { FunctionComponent } from "react";

export interface INavItem {
  icon: string; // icon to be shown on the sidebar
  to: string; // page where it should navigate on clicking
  children: string; // optional title prop to display on hover
}
