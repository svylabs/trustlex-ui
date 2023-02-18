import styles from "~/components/MainLayout/MainLayout.module.scss";

interface IMainLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const MainLayout = ({ title, description, children }: IMainLayoutProps) => {
  return (
    <div className={styles.mainLayoutRoot}>
      <div className={styles.mainLayoutTop}>
        <h1 className={styles.layoutTitle}>{title}</h1>
        <p className={styles.layoutDesc}>{description}</p>
      </div>
      <div className={styles.contentRoot}>{children}</div>
    </div>
  );
};

export default MainLayout;
