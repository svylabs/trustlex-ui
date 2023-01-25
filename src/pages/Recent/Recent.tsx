import React from "react";
import Tabs from "~/components/Tabs/Tabs";

type Props = {};

const Recent = (props: Props) => {
  return (
    <div>
      <Tabs
        tabs={[
          { label: "My Swaps", value: "my-swaps" },
          { label: "All Swaps", value: "all-swaps" },
        ]}
        panels={[
          {
            value: "my-swaps",
            children: <h1>My Swaps</h1>,
          },
          {
            value: "all-swaps",
            children: <h1>All Swaps</h1>,
          },
        ]}
      />
    </div>
  );
};

export default Recent;
