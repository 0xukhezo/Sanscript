import { abi } from "@/abis/abis";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useWaitForTransaction } from "wagmi";
import detectEthereumProvider from "@metamask/detect-provider";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { IDKitWidget } from "@worldcoin/idkit";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Web3AuthOptions } from "@web3auth/modal";
import apeCoin1 from "../../../public/Apecoin.svg";
import usdc1 from "../../../public/Usdc.svg";
import { create } from "ipfs-http-client";
import { Web3AuthModalPack } from "../../utils";
import Loader from "../Loader/Loader";
import Toggled from "../Toggled/Toggled";
import Woldcoin1 from "../../../public/Woldcoin.svg";

const Woldcoin = { Woldcoin1 };

interface NewNewsLetterFormProps {
  getSuccess: (state: boolean) => void;
}
const apeCoin = { apeCoin1 };
const usdc = { usdc1 };

const WEB3AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY;

export default function NewNewsLetterForm({
  getSuccess,
}: NewNewsLetterFormProps) {
  const [ipfsLink, setIpfsLink] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [worldCoin, setWorldCoin] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(10.99);
  const [conexionType, setConexionType] = useState<string | null>("");
  const [web3AuthModalPack, setWeb3AuthModalPack] =
    useState<Web3AuthModalPack>();
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const [hashApproveSafe, setHashApproveSafe] = useState<
    `0x${string}` | undefined
  >();
  const [approveSafeStatus, setApproveSafeStatus] = useState<boolean>(false);
  const [hashCreateSafe, setHashCreateSafe] = useState<
    `0x${string}` | undefined
  >();
  const [createSafeStatus, setCreateSafeStatus] = useState<boolean>(false);

  const usdcfake = "0xd55c3f5961Ec1ff0eC1741eDa7bc2f5962c3c454";
  const lockAddress = "0x7Af80E3881E7ECfCeEb4EeA7039B72579afFf7FD";

  const { isLoading: isLoadingApproveSafe } = useWaitForTransaction({
    hash: hashApproveSafe,
  });

  const { isLoading: isLoadingCreateSafe } = useWaitForTransaction({
    hash: hashCreateSafe,
  });

  async function waitForTransactionReceipt(txHash?: any, provider?: any) {
    let txReceipt = null;

    if (conexionType !== "openlogin") {
      let maxAttempts = 20;

      while (!txReceipt) {
        try {
          for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const txReceipt = await window.ethereum.request({
              method: "eth_getTransactionReceipt",
              params: [txHash],
            });
            if (txReceipt) {
              return txReceipt.status === "0x1";
            }

            await new Promise((resolve) => setTimeout(resolve, 10000));
          }

          console.log(
            `La transacción con hash "${txHash}" no pudo encontrarse después de ${maxAttempts} intentos.`
          );
          return false;
        } catch (error) {
          console.error("Error obtaining the tx receipt", error);
          return false;
        }
      }
    } else {
      while (!txReceipt) {
        try {
          txReceipt = await provider.getTransactionReceipt(txHash);
          if (!txReceipt) {
            await new Promise((resolve) => setTimeout(resolve, 10000));
          } else {
            return txReceipt.status;
          }
        } catch (error) {
          console.error("Error obtaining the tx receipt", error);
          break;
        }
      }
    }
  }

  const onApporveClick = async () => {
    if (conexionType === "openlogin") {
      if (web3AuthModalPack && web3AuthModalPack.getProvider()) {
        (async () => {
          try {
            const provider = new ethers.providers.Web3Provider(
              web3AuthModalPack?.getProvider()!
            );
            const signer = provider.getSigner();
            const erc20Contract = new ethers.Contract(
              usdcfake,
              abi.usdcFake,
              signer
            );

            const tx = await erc20Contract.approve(
              lockAddress,
              ethers.utils.parseEther(price.toString()).toString()
            );
            setHashApproveSafe(tx.hash);
            const txReceiptStatus = await waitForTransactionReceipt(
              tx.hash,
              provider
            );
            txReceiptStatus === 1 && setApproveSafeStatus(true);
          } catch (error) {
            console.error("Error:", error);
          }
        })();
      }
    } else {
      try {
        if (hasProvider) {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const signer = new ethers.providers.Web3Provider(
            window.ethereum
          ).getSigner(accounts[0]);

          const erc20Contract = new ethers.Contract(
            usdcfake,
            abi.usdcFake,
            signer
          );

          const tx = await erc20Contract.approve(
            lockAddress,
            ethers.utils.parseEther(price.toString()).toString()
          );
          setHashApproveSafe(tx.hash);
          const txReceiptStatus = await waitForTransactionReceipt(tx.hash);
          txReceiptStatus && setApproveSafeStatus(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onCreateNewsLetterClick = async () => {
    if (conexionType === "openlogin") {
      if (web3AuthModalPack && web3AuthModalPack.getProvider()) {
        (async () => {
          try {
            const provider = new ethers.providers.Web3Provider(
              web3AuthModalPack?.getProvider()!
            );
            const signer = provider.getSigner();
            const erc20Contract = new ethers.Contract(
              lockAddress,
              abi.subsblockAbi,
              signer
            );
            const tx = await erc20Contract.addNewsletter(
              ipfsLink,
              title,
              description,
              usdcfake,
              ethers.utils.parseEther(price.toString()).toString()
            );

            setHashCreateSafe(tx.hash);
            const txReceiptStatus = await waitForTransactionReceipt(
              tx.hash,
              provider
            );
            txReceiptStatus === 1 && setCreateSafeStatus(true);
            getSuccess(true);
          } catch (error) {
            console.error("Error:", error);
          }
        })();
      }
    } else {
      try {
        if (hasProvider) {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const signer = new ethers.providers.Web3Provider(
            window.ethereum
          ).getSigner(accounts[0]);
          const erc20Contract = new ethers.Contract(
            lockAddress,
            abi.subsblockAbi,
            signer
          );
          const tx = await erc20Contract.addNewsletter(
            ipfsLink,
            title,
            description,
            usdcfake,
            ethers.utils.parseEther(price.toString()).toString()
          );
          setHashCreateSafe(tx.hash);

          const txReceiptStatus = await waitForTransactionReceipt(tx.hash);
          txReceiptStatus && setCreateSafeStatus(true);
          getSuccess(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    (async () => {
      const type = localStorage.getItem("Web3Auth-cachedAdapter");
      setConexionType(type);
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
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setHasProvider(Boolean(provider));
    };

    getProvider();
  }, []);

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      try {
        const ipfs = create({
          host: "localhost",
          port: 5001,
          protocol: "http",
        });

        const blob = new Blob([file]);
        const addedFile = await ipfs.add(blob);
        const cid = addedFile.cid.toString();

        setIpfsLink(cid);
      } catch (error) {
        console.error("Error al subir la imagen a IPFS:", error);
      }
    }
  }

  const handleValue = (name: string, value: string) => {
    const setters: { [key: string]: (value: string) => void } = {
      title: setTitle,
      description: setDescription,
      price: (value: string) => setPrice(Number(value)),
    };

    const setter = setters[name];
    if (setter) {
      setter(value);
    }
  };

  return (
    <div>
      <div>
        <label className="text-lg text-lightText">Title:</label>
        <input
          value={title}
          onChange={(e) => handleValue("title", e.target.value)}
          type="string"
          name="title"
          id="title"
          className="px-4 block w-full border-black rounded-lg  my-4 border-2 py-1.5 text-gray-900  placeholder:text-gray-400 sm:text-sm sm:leading-6"
        />
      </div>
      <div>
        <label className="text-lg text-lightText">Description:</label>
        <textarea
          value={description}
          onChange={(e) => handleValue("description", e.target.value)}
          name="description"
          id="titdescriptionle"
          className="h-20 px-4 block w-full border-black rounded-lg  my-4 border-2 py-1.5 text-gray-900  placeholder:text-gray-400 sm:text-sm sm:leading-6"
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <label className="text-lg text-lightText">Image:</label>
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            name="ipfsLink"
            id="ipfsLink"
            className="px-4 block w-full border-black rounded-lg  my-4 border-2 py-1.5 text-gray-900  placeholder:text-gray-400 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="mt-6">
          <Toggled />
          <div className="flex w-20 justify-between">
            {" "}
            <Image
              src={usdc.usdc1.src}
              height={24}
              width={24}
              alt="Usdc Image"
            />
            <Image
              src={apeCoin.apeCoin1.src}
              height={24}
              width={24}
              alt="Aprcoin Image"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-lg text-lightText">Price:</label>
        <input
          value={price}
          onChange={(e) => handleValue("price", e.target.value)}
          onFocus={(e) =>
            e.target.addEventListener(
              "wheel",
              function (e) {
                e.preventDefault();
              },
              { passive: false }
            )
          }
          step="any"
          type="number"
          name="price"
          id="price"
          className=" px-4 block w-full border-black rounded-lg  my-4 border-2 py-1.5 text-gray-900  placeholder:text-gray-400 sm:text-sm sm:leading-6"
        />
      </div>
      {worldCoin ? (
        approveSafeStatus ? (
          isLoadingCreateSafe && !createSafeStatus ? (
            <button className="px-10 py-2 bg-main rounded-lg flex mx-auto text-white items-center">
              <span className="mr-2">Creating...</span>
              <Loader />
            </button>
          ) : (
            <button
              className="px-10 py-2 bg-main rounded-lg flex mx-auto text-white"
              onClick={() => onCreateNewsLetterClick()}
            >
              Create!
            </button>
          )
        ) : isLoadingApproveSafe && !approveSafeStatus ? (
          <button className="px-10 py-2 bg-main rounded-lg flex mx-auto text-white items-center">
            <span className="mr-2">Approving...</span>
            <Loader />
          </button>
        ) : (
          <button
            className="px-10 py-2 bg-main rounded-lg flex mx-auto text-white"
            onClick={() => onApporveClick()}
          >
            Approve
          </button>
        )
      ) : (
        <IDKitWidget
          app_id="app_staging_0142a1d230ca7cb13ce7cb8a0e94e4ac"
          action="verifiedhumanowner"
          onSuccess={() => setWorldCoin(true)}
          credential_types={["orb", "phone"]}
          enableTelemetry
        >
          {({ open }) => (
            <button
              onClick={open}
              className="px-10 py-2 bg-main rounded-lg flex mx-auto text-white items-center"
            >
              <Image
                src={Woldcoin.Woldcoin1.src}
                height={40}
                width={40}
                alt="Logo Image"
              />
              <span>Verify with World ID</span>
            </button>
          )}
        </IDKitWidget>
      )}
    </div>
  );
}
