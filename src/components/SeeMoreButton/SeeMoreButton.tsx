import styles from "./SeeMoreButton.module.scss";
const SeeMoreButton = ({
  buttonText,
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  buttonText?: string;
}) => {
  return (
    <div className={styles.seeMore} onClick={onClick}>
      <span>{buttonText !== undefined ? buttonText : "See More"}</span>

      <svg
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.33301 8.5H12.6663"
          stroke="url(#paint0_linear_428_633)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 3.83301L12.6667 8.49967L8 13.1663"
          stroke="url(#paint1_linear_428_633)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_428_633"
            x1="7.99967"
            y1="8.5"
            x2="7.99967"
            y2="9.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFD572" />
            <stop offset="1" stopColor="#FEBD38" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_428_633"
            x1="10.3333"
            y1="3.83301"
            x2="10.3333"
            y2="13.1663"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFD572" />
            <stop offset="1" stopColor="#FEBD38" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default SeeMoreButton;
