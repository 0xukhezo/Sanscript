import { abi } from "@/abis/abis";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import { useWaitForTransaction } from "wagmi";
import detectEthereumProvider from "@metamask/detect-provider";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Web3AuthOptions } from "@web3auth/modal";
import { MetaMaskSDK } from "@metamask/sdk";

import { create } from "ipfs-http-client";
import { Web3AuthModalPack } from "../../utils";

interface NewNewsLetterFormProps {
  getSuccess: (state: boolean) => void;
}

const WEB3AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY;

export default function NewNewsLetterForm({
  getSuccess,
}: NewNewsLetterFormProps) {
  const [ipfsLink, setIpfsLink] = useState<string>(" ");
  const [description, setDescription] = useState<string>(" ");
  const [title, setTitle] = useState<string>(" ");
  const [price, setPrice] = useState<number>(10);
  const [conexionType, setConexionType] = useState<string | null>("");
  const [web3AuthModalPack, setWeb3AuthModalPack] =
    useState<Web3AuthModalPack>();

  const [hashApproveSafe, setHashApproveSafe] = useState<
    `0x${string}` | undefined
  >();
  const [approveSafeStatus, setApproveSafeStatus] = useState<boolean>(false);
  const [hashCreateSafe, setHashCreateSafe] = useState<
    `0x${string}` | undefined
  >();
  const [createSafeStatus, setCreateSafeStatus] = useState<boolean>(false);

  const usdcfake = "0xBCc6f06b6d41732db56924A4B140fEa2d998F571";
  const lockAddress = "0x727aEBCDF805905bcF80292109dc05eb485330B7";

  const { isLoading: isLoadingApproveSafe } = useWaitForTransaction({
    hash: hashApproveSafe,
  });

  const { isLoading: isLoadingCreateSafe } = useWaitForTransaction({
    hash: hashCreateSafe,
  });

  async function waitForTransactionReceipt(provider: any, txHash: any) {
    let txReceipt = null;

    while (!txReceipt) {
      try {
        txReceipt = await provider.getTransactionReceipt(txHash);
        if (!txReceipt) {
          await new Promise((resolve) => setTimeout(resolve, 10000));
        } else {
          return txReceipt.status;
        }
      } catch (error) {
        console.error("Error al obtener el recibo de la transacción:", error);
        break;
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
            console.log(signer);
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
              provider,
              tx.hash
            );
            txReceiptStatus === 1 && setApproveSafeStatus(true);
          } catch (error) {
            console.error("Error:", error);
          }
        })();
      }
    } else {
      try {
        const provider = await detectEthereumProvider();
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
        console.log(erc20Contract);
        const tx = await erc20Contract.approve(
          lockAddress,
          ethers.utils.parseEther(price.toString()).toString()
        );
        setHashApproveSafe(tx.hash);
        const txReceiptStatus = await waitForTransactionReceipt(
          provider,
          tx.hash
        );
        txReceiptStatus === 1 && setApproveSafeStatus(true);
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
              price
            );

            setHashCreateSafe(tx.hash);
            const txReceiptStatus = await waitForTransactionReceipt(
              provider,
              tx.hash
            );
            txReceiptStatus === 1 && setCreateSafeStatus(true);
          } catch (error) {
            console.error("Error:", error);
          }
        })();
      }
    } else {
      try {
        const provider = await detectEthereumProvider();
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
          price
        );
        setHashCreateSafe(tx.hash);
        const txReceiptStatus = await waitForTransactionReceipt(
          provider,
          tx.hash
        );
        txReceiptStatus === 1 && setCreateSafeStatus(true);
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
    getSuccess(approveSafeStatus);
  }, [approveSafeStatus]);

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
      {approveSafeStatus ? (
        isLoadingCreateSafe && !createSafeStatus ? (
          <button className="px-10 py-2 bg-main rounded-lg flex mx-auto text-lightText">
            Creating
          </button>
        ) : (
          <button
            className="px-10 py-2 bg-main rounded-lg flex mx-auto text-lightText"
            onClick={() => onCreateNewsLetterClick()}
          >
            Create!
          </button>
        )
      ) : isLoadingApproveSafe && !approveSafeStatus ? (
        <button className="px-10 py-2 bg-main rounded-lg flex mx-auto text-lightText">
          Approving
        </button>
      ) : (
        <button
          className="px-10 py-2 bg-main rounded-lg flex mx-auto text-lightText"
          onClick={() => onApporveClick()}
        >
          Approve
        </button>
      )}
    </div>
  );
}
