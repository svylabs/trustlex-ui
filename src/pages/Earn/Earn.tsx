import {
  Gitgraph,
  Mode,
  Orientation,
  templateExtend,
  TemplateName,
} from "@gitgraph/react";
import React from "react";
import { randomHashGenerator } from "~/helpers/randomHashGenerator";
import styles from "./Earn.module.scss";
type Props = {};

const Earn = (props: Props) => {
  var withoutHash = templateExtend(TemplateName.Metro, {
    commit: {
      message: {
        display: true,
        displayHash: true,
      },
      hasTooltipInCompactMode: true,
      dot: {
        color: "#FF9900",
        strokeWidth: 1,
        size: 8,
      },
    },
    branch: {
      lineWidth: 3,
      label: {
        display: false,
      },
    },
  });
  return (
    <div className={styles.earnPage}>
      <section>
        <h3>1. Earn coins by submitting Bitcoin block headers</h3>
        <div className={styles.box}>
          <p className={styles.subTitle}>Earn 10 coins</p>
          <Gitgraph
            options={{
              orientation: Orientation.Horizontal,
              mode: Mode.Compact,
              // generateCommitHash: randomHashGenerator,
              template: withoutHash,
            }}
          >
            {(gitgraph) => {
              const master = gitgraph.branch("master");
              master.commit("Initial commit");
              master.commit({
                subject: "Initial commit 2",
              });
              master.branch("develop");
              const develop = gitgraph.branch("develop");
              develop.commit("Create fork");
            }}
          </Gitgraph>
        </div>
      </section>
      <section>
        <h3>2. Earn 0.05% on transaction by submitting proof of payment</h3>
        <div className={styles.box}>SOmething</div>
      </section>
    </div>
  );
};

export default Earn;
