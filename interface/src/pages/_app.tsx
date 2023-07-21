import NavBar from "@/components/Layout/NavBar";
import "@/styles/globals.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import "primereact/resources/primereact.min.css";
import { mainnet, sepolia } from "@wagmi/chains";
import type { AppProps } from "next/app";

import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { PrimeReactProvider } from "primereact/api";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, sepolia],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PrimeReactProvider>
      <WagmiConfig config={config}>
        {" "}
        <Component {...pageProps} />
      </WagmiConfig>{" "}
    </PrimeReactProvider>
  );
}
