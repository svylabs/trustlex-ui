import { useContext, useEffect, useState } from "react";
import { isMetamaskConnectedService } from "~/service/AppService";
import styles from "~/components/MainLayout/MainLayout.module.scss";
import { BaseContext } from "~/Context/BaseContext";

//------------Import for wallet connect -----------------//

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
// import { Web3Button } from "@web3modal/react";

//------------End Import for wallet connect -----------------//
import NavbarWhileDisconnected from "~/components/Navbar/NavbarWhileDisconnected";

interface IMainLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const MainLayout = ({ title, description, children }: IMainLayoutProps) => {
  const context = useContext(BaseContext);
  if (context === null) {
    return <>Loading...</>;
  }
  const { connectInfo, setConnectinfo } = context;

  const { address, isConnected } = useAccount();
  const { connect: WalletConnect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  useEffect(() => {
    (async () => {
      let isMetamaskConnected = await isMetamaskConnectedService();
      setIsMetamaskConnected(isMetamaskConnected);
    })();
  }, []);

  return (
    <div className={styles.mainLayoutRoot}>
      <div className={styles.mainLayoutTop}>
        {connectInfo.isConnected ? (
          <>
            {" "}
            <h1 className={styles.layoutTitle}>{title}</h1>{" "}
            <p className={styles.layoutDesc}>{description}</p>
          </>
        ) : (
          <>
            {" "}
            <NavbarWhileDisconnected title={title} description={description} />
          </>
        )}
      </div>
      <div className={styles.contentRoot}>{children}</div>
    </div>
  );
};

export default MainLayout;
