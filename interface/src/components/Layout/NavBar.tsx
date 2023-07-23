import { EthHashInfo } from "@safe-global/safe-react-components";
import { useEffect, useState } from "react";
import * as PushAPI from "@pushprotocol/restapi";
import {
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  WALLET_ADAPTERS,
} from "@web3auth/base";

import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Web3AuthOptions } from "@web3auth/modal";
import { InjectedConnector } from "@wagmi/core";
import { useConnect } from "wagmi";
import { AuthKitSignInData, Web3AuthModalPack } from "../../utils";

import { BellIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { EmbedSDK } from "@pushprotocol/uiembed";
import { useRouter } from "next/router";
import Link from "next/link";
import detectEthereumProvider from "@metamask/detect-provider";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { ethers } from "ethers";

const WEB3AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY;

interface NavBarProps {
  getStatus: (status: boolean) => void;
}

export default function NavBar({ getStatus }: NavBarProps) {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const router = useRouter();
  const [eoa, setEoa] = useState<string>("");
  const [loginClick, setLoginClick] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [web3AuthModalPack, setWeb3AuthModalPack] =
    useState<Web3AuthModalPack>();
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] =
    useState<AuthKitSignInData | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );

  const login = async () => {
    setLoginClick(true);
    if (!web3AuthModalPack) return;

    const signInInfo = await web3AuthModalPack.signIn();
    localStorage.setItem("eoa", signInInfo.eoa);
    connect();

    setAddress(signInInfo.eoa);
    setSafeAuthSignInResponse(signInInfo);
    getStatus(true);
    setStatus(true);
    setProvider(web3AuthModalPack.getProvider() as SafeEventEmitterProvider);
  };

  const logout = async () => {
    if (!web3AuthModalPack) return;
    await web3AuthModalPack.signOut();
    localStorage.removeItem("eoa");
    getStatus(false);
    setStatus(false);
    setProvider(null);
    setSafeAuthSignInResponse(null);
  };

  useEffect(() => {
    (async () => {
      const options: Web3AuthOptions = {
        clientId: WEB3AUTH_CLIENT_ID || "",
        web3AuthNetwork: "testnet",
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0xaa36a7",
          rpcTarget: `${INFURA_KEY}`,
        },
        uiConfig: {
          theme: "dark",
          loginMethodsOrder: ["google"],
        },
      };

      const modalConfig = {
        [WALLET_ADAPTERS.TORUS_EVM]: {
          label: "torus",
          showOnModal: false,
        },
        [WALLET_ADAPTERS.METAMASK]: {
          label: "Metamask",
          showOnDesktop: true,
          showOnMobile: true,
        },
      };

      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: "mandatory",
        },
        adapterSettings: {
          uxMode: "popup",
          whiteLabel: {
            name: "Safe",
          },
        },
      });

      const web3AuthModalPack = new Web3AuthModalPack({
        txServiceUrl: "https://safe-transaction-goerli.safe.global",
      });

      await web3AuthModalPack.init({
        options,
        adapters: [openloginAdapter],
        modalConfig,
      });

      setWeb3AuthModalPack(web3AuthModalPack);
    })();
  }, []);

  useEffect(() => {
    setEoa(localStorage.getItem("eoa") as string);
  }, [status]);

  useEffect(() => {
    if (web3AuthModalPack && web3AuthModalPack.getProvider() && loginClick) {
      EmbedSDK.init({
        headerText: "Notifications",
        targetID: "sdk-trigger-id",
        appName: "consumerApp",
        user: address,
        chainId: 5,
        viewOptions: {
          type: "sidebar",
          showUnreadIndicator: true,
          unreadIndicatorColor: "#cc1919",
          unreadIndicatorPosition: "bottom-right",
        },
        theme: "dark",
        onOpen: () => {
          console.log("-> client dApp onOpen callback");
        },
        onClose: () => {
          console.log("-> client dApp onClose callback");
        },
      });

      return () => {
        EmbedSDK.cleanup();
      };
    }
  });

  useEffect(() => {
    if (web3AuthModalPack && web3AuthModalPack.getProvider() && loginClick) {
      (async () => {
        await login();
      })();
    }
  }, [web3AuthModalPack]);

  useEffect(() => {
    setEoa(localStorage.getItem("eoa") as string);
  }, []);

  useEffect(() => {
    setEoa(localStorage.getItem("eoa") as string);
  }, [eoa]);

  const subscribe = async () => {
    const provider = await detectEthereumProvider({ silent: true });
    if (localStorage.getItem("Web3Auth-cachedAdapter") === "openlogin") {
      if (web3AuthModalPack && web3AuthModalPack.getProvider()) {
        (async () => {
          try {
            const provider = new ethers.providers.Web3Provider(
              web3AuthModalPack?.getProvider()!
            );
            const signer = provider.getSigner();
            await PushAPI.channels.subscribe({
              signer: signer,
              channelAddress: `eip155:5:${process.env.NEXT_PUBLIC_PUSH_CHANNEL_ADDRESS}`,
              userAddress: `eip155:5:${eoa}`,
              onSuccess: () => {
                console.log("opt in success");
              },
              onError: () => {
                console.error("opt in error");
              },
              env: "local" as ENV,
            });
          } catch (error) {
            console.error("Error:", error);
          }
        })();
      }
    } else {
      try {
        if (Boolean(provider)) {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const signer = new ethers.providers.Web3Provider(
            window.ethereum
          ).getSigner(accounts[0]);

          await PushAPI.channels.subscribe({
            signer: signer,
            channelAddress: `eip155:5:${process.env.NEXT_PUBLIC_PUSH_CHANNEL_ADDRESS}`,
            userAddress: `eip155:5:${eoa}`,
            onSuccess: () => {
              console.log("opt in success");
            },
            onError: () => {
              console.error("opt in error");
            },
            env: "local" as ENV,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <main
      className={
        router.pathname !== "/"
          ? "flex justify-between pt-6 pb-3 px-6 items-center text-darkText bg-darkBackground z-50 rounded-xl"
          : "flex justify-end pt-6 pb-3 px-6 items-center text-darkText bg-darkBackground z-50 rounded-xl"
      }
    >
      {router.pathname !== "/" && (
        <Link className="flex items-center text-xl" href="/">
          <ChevronLeftIcon
            className="h-4 w-4 text-white mt-0.5"
            aria-hidden="true"
          />
          <span>Back</span>
        </Link>
      )}
      <div>
        {safeAuthSignInResponse?.eoa !== undefined ? (
          <div className="flex  items-center">
            <div className="flex items-center">
              <button id="sdk-trigger-id">
                <BellIcon className="h-6 w-6 text-main" aria-hidden="true" />
              </button>
            </div>
            <div className="px-4">
              <EthHashInfo address={safeAuthSignInResponse?.eoa || eoa} />
            </div>
            <button onClick={logout} className="px-4 py-2 bg-main rounded-full">
              Log Out
            </button>
          </div>
        ) : eoa ? (
          <div className="flex  items-center">
            <div className="flex items-center">
              <button id="sdk-trigger-id">
                <BellIcon className="h-6 w-6 text-main" aria-hidden="true" />
              </button>
            </div>
            <div className="px-4">
              <EthHashInfo address={safeAuthSignInResponse?.eoa || eoa} />
            </div>
            <button onClick={logout} className="px-4 py-2 bg-main rounded-full">
              Log Out
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <button
              onClick={login}
              className="px-4 py-2 bg-darkText rounded-full text-lightText"
            >
              Connect to App
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
