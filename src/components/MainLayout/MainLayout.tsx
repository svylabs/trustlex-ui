import styles from "~/components/MainLayout/MainLayout.module.scss";
import navbarStyles from "~/components/Navbar/Navbar.module.scss";

//------------Import for wallet connect -----------------//

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
// import { Web3Button } from "@web3modal/react";
//------------End Import for wallet connect -----------------//
interface IMainLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const MainLayout = ({ title, description, children }: IMainLayoutProps) => {
  // const { address, isConnected } = useAccount();
  // const { connect } = useConnect({
  //   connector: new InjectedConnector(),
  // });
  // const { disconnect } = useDisconnect();
  let isConnected = true;
  return (
    <div className={styles.mainLayoutRoot}>
      <div className={styles.mainLayoutTop}>
        {isConnected ? (
          <>
            <h1 className={styles.layoutTitle}>{title}</h1>{" "}
            <p className={styles.layoutDesc}>{description}</p>
          </>
        ) : (
          <>
            <nav className={navbarStyles.navbar}>
              <div className={navbarStyles.left}>
                <h1 className={styles.layoutTitle}>{title}</h1>{" "}
                <p className={styles.layoutDesc}>{description}</p>
              </div>

              <div className={navbarStyles.right}>
                {/* <button onClick={() => connect()}>Connect Wallet</button> */}
                {/* <Web3Button /> */}
              </div>
            </nav>
          </>
        )}
      </div>
      <div className={styles.contentRoot}>{children}</div>
    </div>
  );
};

export default MainLayout;
