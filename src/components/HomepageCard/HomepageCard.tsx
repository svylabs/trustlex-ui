import GradientBackgroundContainer from "../GradientBackgroundContainer/GradientBackgroundContainer";
import styles from "./HomepageCard.module.scss";
type Props = {};

const HomepageCard = ({
  color,
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
  color: string;
}) => {
  return (
    <GradientBackgroundContainer colorRight={color}>
      <div className={styles.content}>
        <img src={icon} className={styles.icon} />
        <div className={styles.details}>
          <h4>{title}</h4>
          <p>{value}</p>
        </div>
      </div>
    </GradientBackgroundContainer>
  );
};

export default HomepageCard;
