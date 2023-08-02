import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { Web3Button } from "@web3modal/react";
import { useWeb3Modal } from "@web3modal/react";

const chains = [arbitrum, mainnet, polygon];
const projectId = "f651a9b7ead78bc8fba3196e06188f4b";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

const Connectors = () => {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <HomePage />
        {/* <HomePage2 /> */}
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
};

function HomePage() {
  return <Web3Button />;
}

function HomePage2() {
  const { open, close } = useWeb3Modal();

  return <button onClick={() => open()}>Connect</button>;
}

export default Connectors;
