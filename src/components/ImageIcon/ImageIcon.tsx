import React from "react";
import styles from "./ImageIcon.module.scss";
type Props = {
  image: string;
};

const ImageIcon = ({ image }: Props) => {
  return <img src={image} className={styles.root} />;
};

export default ImageIcon;
