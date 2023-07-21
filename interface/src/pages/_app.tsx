import NavBar from "@/components/Layout/NavBar";
import "@/styles/globals.css";
import { mainnet, sepolia } from "@wagmi/chains";
import type { AppProps } from "next/app";

import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

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
    <WagmiConfig config={config}>
      {" "}
      <NavBar />
      <Component {...pageProps} />
    </WagmiConfig>
  );
}
