import {
  Gitgraph,
  MergeStyle,
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
      mergeStyle: MergeStyle.Straight,
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
              // mode: Mode.Compact,
              generateCommitHash: randomHashGenerator,
              template: withoutHash,
            }}
          >
            {(gitgraph) => {
              const master = gitgraph.branch("master");
              master.commit("Initial commit");
              master.commit({
                subject: "Initial commit 2",
              });
              master.tag("v1.20.1");
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

function CommitDot({ commit }: { commit: any }) {
  let commitSize = commit.style.dot.size * 2;
  return React.createElement(
    "g",
    {
      transform: "translate(" + (commitSize + 10) + ", " + commitSize / 2 + ")",
    },
    React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 71.84 75.33",
        height: "30",
        width: "30",
      },
      React.createElement(
        "g",
        { fill: commit.style.dot.color, stroke: "white", strokeWidth: "2" },
        React.createElement("path", {
          d: "M68.91,35.38c4.08-1.15,3.81-3-.22-3.75-3.1-.7-18.24-5.75-20.71-6.74-2.15-1-4.67-.12-1,3.4,4,3.53,1.36,8.13,2.79,13.47C50.6,44.89,52.06,49,56,55.62c2.09,3.48,1.39,6.58-1.42,6.82-1.25.28-3.39-1.33-3.33-3.82h0L44.68,43.79c1.79-1.1,2.68-3,2-4.65s-2.5-2.29-4.46-1.93l-1.92-4.36a3.79,3.79,0,0,0,1.59-4.34c-.62-1.53-2.44-2.27-4.37-2L36,22.91c1.65-1.12,2.46-3,1.83-4.52a3.85,3.85,0,0,0-4.37-1.95c-.76-1.68-2.95-6.89-4.89-10.73C26.45,1.3,20.61-2,16.47,1.36c-5.09,4.24-1.46,9-6.86,12.92l2.05,5.35a18.58,18.58,0,0,0,2.54-2.12c1.93-2.14,3.28-6.46,3.28-6.46s1-4,2.2-.57c1.48,3.15,16.59,47.14,16.59,47.14a1,1,0,0,0,0,.11c.37,1.48,5.13,19,19.78,17.52,4.38-.52,6-1.1,9.14-3.83,3.49-2.71,5.75-6.08,5.91-12.62.12-4.67-6.22-12.62-5.81-17S66.71,36,68.91,35.38Z",
        }),
        React.createElement("path", {
          d: "M2.25,14.53A28.46,28.46,0,0,1,0,17.28s3,4.75,9.58,3a47.72,47.72,0,0,0-1.43-5A10.94,10.94,0,0,1,2.25,14.53Z",
        })
      )
    ),
    React.createElement(
      "text",
      { x: 40, y: 15, fill: commit.style.dot.color },
      commit.hashAbbrev,
      " - ",
      commit.subject
    )
  );
}
