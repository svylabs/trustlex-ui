import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

//------------Import for wallet connect -----------------//
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig, Provider } from "wagmi";
import { arbitrum, mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { Web3Button } from "@web3modal/react";

//------------End Import for wallet connect -----------------//

// ------------------------Variables for wallet connect--------------------------- //
const chains = [polygonMumbai];
const projectId = "f651a9b7ead78bc8fba3196e06188f4b";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);
// console.log(ethereumClient);

// ------------------------End Variables for wallet connect--------------------------- //

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <WagmiConfig config={wagmiConfig}>
      <App />
    </WagmiConfig>
    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
  </>
);
