/// <reference types="vite/client" />
/// <reference types="react-scripts" />

import ethers from "ethers";

declare module "stream-browserify";
import { Stream } from "stream-browserify";
declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider;
    Stream: Stream;
  }
}
declare module "wif";
declare module "bip38";
declare module 'react-mermaid';
declare module 'react-faq-component';
// declare module "vite-plugin-wasm";