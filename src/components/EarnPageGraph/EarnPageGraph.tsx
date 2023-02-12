import { getIconFromCurrencyType } from "~/utils/getIconFromCurrencyType";
import ImageIcon from "../ImageIcon/ImageIcon";
import styles from "./EarnPageGraph.module.scss";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
import {
  Gitgraph,
  MergeStyle,
  Mode,
  Orientation,
  templateExtend,
  TemplateName,
} from "@gitgraph/react";
import { randomHashGenerator } from "~/helpers/randomHashGenerator";
import { CurrencyEnum } from "~/enums/CurrencyEnum";
import React, { useRef } from "react";
import Button from "../Button/Button";
import { VariantsEnum } from "~/enums/VariantsEnum";
import useAutoHideScrollbar from "~/hooks/useAutoHideScrollBar";
import { clsx } from "@mantine/core";

const withoutHash = templateExtend(TemplateName.Metro, {
  tag: {
    color: "black",
    strokeColor: "#ce9b00",
    bgColor: "#ffce52",
    font: "italic 12pt serif",
    borderRadius: 0,
    pointerWidth: 6,
  },
  commit: {
    message: {
      display: false,
      displayHash: false,
      displayAuthor: false,
    },
    hasTooltipInCompactMode: true,

    dot: {
      color: "#FF9900",
      // strokeColor: "#FFD572",
      // strokeWidth: 2,
      // strokeWidth: 1,
      size: 8,
    },
  },
  branch: {
    lineWidth: 2,
    label: {
      // display: false,
      display: false,
      // bgColor: "#ffce52",
      // color: "black",
      // strokeColor: "#ce9b00",
      // borderRadius: 0,
    },

    mergeStyle: MergeStyle.Straight,
  },
});

interface IBlock {
  active: boolean;
  extended: boolean;
  number: number;
}

interface IBlocksProps extends IBlock {
  extendList: IBlock[] | [];
}

const EarnPageGraph = () => {
  const { mobileView } = useWindowDimensions();

  const options = {
    orientation: !mobileView
      ? Orientation.Horizontal
      : Orientation.VerticalReverse,
    mode: Mode.Compact,
    generateCommitHash: randomHashGenerator,
    template: withoutHash,
    // template: TemplateName.BlackArrow,
  };

  const blocks: IBlocksProps[] = [
    {
      active: true,
      extended: false,
      number: 760000,
      extendList: [],
    },
    {
      active: false,
      extended: true,
      number: 760000,
      extendList: [
        {
          active: false,
          extended: false,
          number: 760000,
        },
        {
          active: false,
          extended: false,
          number: 760000,
        },
        {
          active: false,
          extended: false,
          number: 760000,
        },
        {
          active: false,
          extended: false,
          number: 760000,
        },
      ],
    },
    {
      active: false,
      extended: false,
      number: 760000,
      extendList: [],
    },
    {
      active: false,
      extended: false,
      number: 760000,
      extendList: [],
    },
    {
      active: false,
      extended: false,
      number: 760000,
      extendList: [],
    },
  ];

  return (
    <div className={styles.box}>
      <p className={styles.subTitle}>
        Earn coins by submitting{" "}
        <ImageIcon image={getIconFromCurrencyType(CurrencyEnum.BTC)} /> Bitcoin
        block headers coins
      </p>
      <div className={styles.gitGraph}>
        <CustomGraph blocks={blocks} />
        {/* <Gitgraph options={options}>
          {(gitgraph) => {
            const master = gitgraph
              .branch({
                name: "master",
              })
              .commit({
                subject: "",
                renderDot: () => {
                  return <></>;
                },
              })
              .commit({
                subject: "",
                style: {
                  dot: {
                    color: "#707070",
                    strokeColor: "#FFD572",
                    strokeWidth: 2,
                  },
                },
              })
              .commit({
                subject: "",
                style: {
                  dot: {
                    color: "#707070",
                  },
                },
              })
              .branch({
                name: "develop",
                style: {
                  color: "#909092",
                },
              })
              .commit({
                subject: "",
                style: {
                  dot: {
                    color: "#707070",
                    // strokeColor: "#FFD572",
                    // strokeWidth: 2,
                  },
                },
              });
          }}
        </Gitgraph>
        <div className={styles.submitButton}>
          <Button
            variant={VariantsEnum.primary}
            radius={10}
            style={{
              height: "4.5rem",
            }}
          >
            Submit next block
          </Button>
        </div>

        <div className={styles.submitButton1}>
          <Button
            variant={VariantsEnum.primary}
            radius={10}
            style={{
              height: "4.5rem",
            }}
          >
            Submit next block
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default EarnPageGraph;

function RenderTooltip(commit: any) {
  var commitSize = commit.style.dot.size * 2;
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

const CustomGraph = ({ blocks }: { blocks: IBlocksProps[] }) => {
  const { tabletView } = useWindowDimensions();

  return (
    <div className={styles.graphBoxContainer}>
      <div className={styles.graphBox}>
        <Line />

        {blocks.map((block, index) => {
          return (
            <>
              {block.extended && block.extendList.length > 0 ? (
                <ExtendedPoint active={false} extendedList={block.extendList} />
              ) : (
                <Point active={block.active} />
              )}
              <Line />
            </>
          );
        })}

        <Button
          variant={VariantsEnum.primary}
          radius={10}
          style={{
            width: "197px",
            height: "42px",
          }}
        >
          Submit next block
        </Button>
      </div>
    </div>
  );
};

const Line = ({ width, height }: { width?: string; height?: string }) => {
  return (
    <div className={styles.lineContainer}>
      <div
        className={styles.line}
        style={{
          width: width,
          height: height,
        }}
      ></div>
    </div>
  );
};

const VerticalLine = ({
  width,
  rotate,
}: {
  width?: string;
  rotate?: string;
}) => {
  return (
    <div
      className={styles.line}
      style={{
        width: width,
        rotate: rotate,
      }}
    ></div>
  );
};

const Point = ({
  active,
  reverseData,
}: {
  active: boolean;
  reverseData?: boolean;
}) => {
  return (
    <div
      className={`${styles.pointerBox} ${reverseData && styles.reverseData}`}
    >
      <span
        className={`${styles.pointNumber} ${active && styles.activePointer}`}
      >
        760000
      </span>

      <div
        className={`${styles.checkboxContainer} ${
          active && styles.activeCheckbox
        }`}
      >
        <input
          type="radio"
          className={styles.checkbox}
          readOnly
          checked={active ? true : false}
        />
      </div>
    </div>
  );
};

const ExtendedPoint = ({
  active,
  extendedList,
}: {
  active: boolean;
  extendedList: IBlock[] | [];
}) => {
  const { tabletView } = useWindowDimensions();
  return (
    <div className={styles.extendedPoint}>
      <Point active={active} />

      {extendedList.map((block, index) => {
        return (
          <div className={styles.extendedLine} key={index}>
            {index === 0 && (
              <>
                <VerticalLine rotate="45deg" width="65px" />
                <div className={styles.linepoint}>
                  <Point
                    active={false}
                    reverseData={!tabletView ? true : false}
                  />
                </div>
                <div className={styles.extendedButton}>
                  <Button
                    variant={VariantsEnum.primary}
                    radius={10}
                    style={{
                      width: "197px",
                      height: "42px",
                      marginLeft: "5rem",
                    }}
                  >
                    Submit next block
                  </Button>
                </div>
              </>
            )}

            {/* {index > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: "80px",
                  top: "8px",
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <Line />
                <Point active={block.active} reverseData={true} />
              </div>
            )} */}
          </div>
        );
      })}

      {/* <div className={styles.extendedLine}>
        <VerticalLine rotate="45deg" width="65px" />
        <div className={styles.linepoint}>
          <Point active={false} reverseData={!tabletView ? true : false} />
        </div>
      
        <div className={styles.extendedButton}>
          <Button
            variant={VariantsEnum.primary}
            radius={10}
            style={{
              width: "197px",
              height: "42px",
              marginLeft: "5rem",
            }}
          >
            Submit next block
          </Button>
        </div>
      </div> */}
    </div>
  );
};
