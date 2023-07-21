import { EthHashInfo } from "@safe-global/safe-react-components";
import { useEffect, useState } from "react";
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

import { BellIcon } from "@heroicons/react/24/outline";
import { EmbedSDK } from "@pushprotocol/uiembed";
import { useRouter } from "next/router";

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
    setProvider(web3AuthModalPack.getProvider() as SafeEventEmitterProvider);
  };

  const logout = async () => {
    if (!web3AuthModalPack) return;

    await web3AuthModalPack.signOut();
    localStorage.removeItem("eoa");
    getStatus(false);
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

  return (
    <main
      className={
        router.pathname === "/"
          ? "flex justify-end py-6 px-6 items-center text-darkText bg-darkBackground z-50 rounded-xl"
          : "flex justify-end py-6 px-6 items-center text-darkText bg-darkBackground"
      }
    >
      <div>
        {eoa || safeAuthSignInResponse?.eoa ? (
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button id="sdk-trigger-id">
                <BellIcon className="h-6 w-6 text-main" aria-hidden="true" />
              </button>
            </div>
            <div className="px-4">
              <EthHashInfo address={safeAuthSignInResponse?.eoa || eoa} />
            </div>
            <button onClick={logout} className="px-4 py-2 bg-main rounded-lg">
              Log Out
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <button onClick={login} className="px-4 py-2 bg-main rounded-lg">
              Login
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
