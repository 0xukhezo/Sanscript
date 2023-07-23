import React, { useEffect, useRef, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import Image from "next/image";
import WalletFund from "@/components/OnrampSafe/WalletFund";
import Chat from "@/components/Chat/Chat";
import { ethers } from "ethers";
import { client, NewsLetters } from "./api/Newsletters";
import ImageIpfsDisplay from "@/components/ImageIpfsDisplay/ImageIpfsDisplay";
import NavBar from "@/components/Layout/NavBar";
import { useRouter } from "next/router";
import {
  ChevronDownIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

import Link from "next/link";
import MediumDark from "../../public/MediumDark.svg";
import GithubDark from "../../public/GithubDark.svg";
import Logo1 from "../../public/Logo.svg";
import LensDark from "../../public/LensDark.svg";
import TwitterDark from "../../public/TwitterDark.svg";
import CreateNewsLetterModal from "@/components/Modal/CreateNewsLetterModal";

import { abi } from "@/abis/abis";
import detectEthereumProvider from "@metamask/detect-provider";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Web3AuthOptions } from "@web3auth/modal";

import { Web3AuthModalPack } from "../utils";

const WEB3AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY;

const Logo = { Logo1 };
const twitterImgDark = { TwitterDark };
const githubImgDark = { GithubDark };
const lensImgDark = { LensDark };
const mediumImgDark = { MediumDark };

const iconsFooterDark = [
  {
    img: twitterImgDark.TwitterDark.src,
    href: "",
  },
  {
    img: githubImgDark.GithubDark.src,
    href: "",
  },
  {
    img: lensImgDark.LensDark.src,
    href: "",
  },
  {
    img: mediumImgDark.MediumDark.src,
    href: "",
  },
];

type Icon = {
  img: string;
  href: string;
};

export default function NewLetter() {
  const [eoa, setEoa] = useState<string>(null);
  const [newsLetter, setNewsLetter] = useState<any>();
  const [subscriptors, setSubscriptors] = useState<any>();
  const [newsLettersOwned, setNewsLettersOwned] = useState<Object[]>([]);
  const [conexionType, setConexionType] = useState<string | null>("");
  const [newsLetterSuscribed, setNewsLetterSuscribed] =
    useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [messages, setMessages] = useState<any>(null);
  const [subscribedNewsLettersIds, setSubscribedNewsLettersIds] =
    useState<any>();
  const [web3AuthModalPack, setWeb3AuthModalPack] =
    useState<Web3AuthModalPack>();
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);

  const convRef = useRef<any>(null);
  const clientRef = useRef<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [isOnNetwork, setIsOnNetwork] = useState<any>(false);
  const router = useRouter();

  const usdcfake = "0xd55c3f5961Ec1ff0eC1741eDa7bc2f5962c3c454";
  const lockAddress = "0x7Af80E3881E7ECfCeEb4EeA7039B72579afFf7FD";

  async function fetchNewsletterSuscriptor() {
    if (router) {
      const route = router.query.newLetter as string;
      const nonce = route?.substring(route?.lastIndexOf("_") + 1);

      const apiUrl = `http://localhost:3001/api/v1/newsletter/subscriptors?newsletterOwner=${ethers.utils.getAddress(
        route?.substring(0, route?.lastIndexOf("_"))
      )}&newsletterNonce=${nonce}`;

      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("No se pudo obtener la respuesta del servidor.");
        }

        const data = await response.json();

        setSubscriptors(data);

        return data;
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw error;
      }
    }
  }

  async function fetchNewsletterByAddress() {
    if (eoa !== null) {
      const apiUrl = `http://localhost:3001/api/v1/newsletter/${ethers.utils.getAddress(
        eoa
      )}`;

      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("No se pudo obtener la respuesta del servidor.");
        }

        const data = await response.json();

        setSubscribedNewsLettersIds(data);

        const route = router.query.newLetter as string;

        const isStringInArray = data.some((obj: any) => {
          return (
            obj.newsletterOnwer ===
            ethers.utils.getAddress(
              route?.substring(0, route?.lastIndexOf("_"))
            )
          );
        });

        setNewsLetterSuscribed(isStringInArray);
        return data;
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw error;
      }
    }
  }

  async function fetchNewsLetter(query: string) {
    const queryBody = `query {
      newsletters(where: {id: "${query}"}) {
        id
        image
        description
        pricePerMonth
        title
        newsletterOwner {
          id
        }
        newsletterNonce
      }
    }`;

    try {
      let response = await client.query({ query: NewsLetters(queryBody) });

      setNewsLetter(response.data.newsletters[0]);
    } catch (err) {
      console.log({ err });
    }
  }

  async function fetchNewsLetterByOwner(query: string) {
    const queryBody = `query {newsletters(
      where: {newsletterOwner_: {id: "${query}"}}
    ) {
      id
      image
      description
      newsletterOwner {
        id
      }
      pricePerMonth
      title
      newsletterNonce
      }
    }`;

    try {
      let response = await client.query({ query: NewsLetters(queryBody) });
      console.log(response);
      setNewsLetter(response.data.newsletters[0]);
    } catch (err) {
      console.log({ err });
    }
  }

  async function fetchNewsLetters() {
    const queryBody = `query {
      newsletters {
        id
        image
        description
        newsletterOwner {
          id
        }
        pricePerMonth
        title
        newsletterNonce
        }
      }`;

    try {
      let response = await client.query({ query: NewsLetters(queryBody) });

      setNewsLettersOwned(
        response.data.newsletters.filter((newsLetter: any) => {
          return newsLetter.newsletterOwner.id === eoa.toLowerCase();
        })
      );
    } catch (err) {
      console.log({ err });
    }
  }

  const newConversation = async function (xmtp_client: any, addressTo: any) {
    if (eoa?.toLowerCase() !== newsLetter.newsletterOwner.id) {
      addressTo = newsLetter.newsletterOwner.id;
    }

    if (await xmtp_client?.canMessage(addressTo)) {
      const conversation = await xmtp_client.conversations.newConversation(
        addressTo
      );
      convRef.current = conversation;

      const messages = await conversation.messages();
      setMessages(messages);
    } else {
      console.log("cant message because is not on the network.");
    }
  };

  const initXmtp = async function () {
    const xmtp = await Client.create(signer, { env: "production" });
    subscriptors.forEach((value: any) => newConversation(xmtp, value));

    setIsOnNetwork(!!xmtp.address);

    clientRef.current = xmtp;
  };

  const getStatus = (statusNavbar: boolean) => {
    setStatus(statusNavbar);
  };

  const getOpenModal = (modalClose: boolean) => {
    setOpenModal(modalClose);
  };

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
              usdcfake,
              abi.usdcFake,
              signer
            );

            const subsblockAbiContract = new ethers.Contract(
              lockAddress,
              abi.subsblockAbi,
              signer
            );

            const txApprove = await erc20Contract.approve(
              lockAddress,
              newsLetter.pricePerMonth.toString()
            );

            await waitForTransactionReceipt(txApprove.hash, provider);

            const txSubsblock = await subsblockAbiContract.subscribeNewsletter(
              ethers.utils.getAddress(newsLetter.newsletterOwner.id),
              newsLetter.newsletterNonce
            );

            await waitForTransactionReceipt(txSubsblock.hash, provider);
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

          const subsblockAbiContract = new ethers.Contract(
            lockAddress,
            abi.subsblockAbi,
            signer
          );

          const txApprove = await erc20Contract.approve(
            lockAddress,
            newsLetter.pricePerMonth.toString()
          );

          await waitForTransactionReceipt(txApprove.hash);

          const txSubsblock = await subsblockAbiContract.subscribeNewsletter(
            ethers.utils.getAddress(newsLetter.newsletterOwner.id),
            newsLetter.newsletterNonce
          );

          await waitForTransactionReceipt(txSubsblock.hash);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const type = localStorage.getItem("Web3Auth-cachedAdapter");
    setConexionType(type);
    router !== undefined && fetchNewsLetters();
    router !== undefined && fetchNewsLetter(router.query.newLetter as string);
    setEoa(localStorage.getItem("eoa") as string);
    const provider =
      web3AuthModalPack &&
      new ethers.providers.Web3Provider(web3AuthModalPack?.getProvider()!);

    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setSigner(provider.getSigner());
      } catch (error) {
        console.error("User rejected request", error);
      }
    } else {
      console.error("Metamask not found");
    }
  }, []);

  useEffect(() => {
    const type = localStorage.getItem("Web3Auth-cachedAdapter");
    setConexionType(type);
    router !== undefined && fetchNewsLetters();
    router !== undefined && fetchNewsLetter(router.query.newLetter as string);
    setEoa(localStorage.getItem("eoa") as string);
    if (web3AuthModalPack) {
      const provider = new ethers.providers.Web3Provider(
        web3AuthModalPack?.getProvider()!
      );
      setSigner(provider.getSigner());
    }
  }, [web3AuthModalPack]);

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

  useEffect(() => {
    setEoa(localStorage.getItem("eoa") as string);
    fetchNewsLetter(router.query.newLetter as string);
    fetchNewsletterSuscriptor();
    fetchNewsletterByAddress();
  }, [eoa, router]);

  useEffect(() => {
    if (isOnNetwork && convRef.current) {
      const streamMessages = async () => {
        const newStream = await convRef.current.streamMessages();
        for await (const msg of newStream) {
          const exists = messages.find((m: any) => m.id === msg.id);
          if (!exists) {
            setMessages((prevMessages: any[]) => {
              const msgsnew = [...prevMessages, msg];
              return msgsnew;
            });
          }
        }
      };
      streamMessages();
    }
  }, [messages, isOnNetwork]);

  useEffect(() => {
    setEoa(localStorage.getItem("eoa") as string);
  }, [status]);

  useEffect(() => {
    subscribedNewsLettersIds !== undefined &&
      fetchNewsLetterByOwner(subscribedNewsLettersIds[0].newsletterOnwer);
  }, [subscribedNewsLettersIds]);

  return (
    <>
      <main className="grid lg:grid-cols-4 lg:max-w-[1668px]">
        <section className="lg:max-w-[520px] col-span-1 mx-4 mt-4">
          <div className="flex flex-col justify-between bg-darkBackground h-[184px] rounded-xl">
            <div className="flex flex-col mx-6">
              <Link className="lg:text-lg flex my-4" href="/">
                <Image
                  src={Logo.Logo1.src}
                  height={31}
                  width={31}
                  alt="Logo Image"
                />
                <span className="ml-2 text-4xl font-light">Sanscript</span>
              </Link>{" "}
              <Link className="lg:text-lg flex mt-4 mb-6" href="/">
                <HomeIcon
                  className="h-6 w-6 text-white mr-2"
                  aria-hidden="true"
                />
                <span>Home</span>
              </Link>{" "}
              <div className="lg:text-lg flex">
                <MagnifyingGlassIcon
                  className="h-6 w-6 text-darkText mr-2"
                  aria-hidden="true"
                />
                <span>Search Newsletters</span>
              </div>{" "}
            </div>
          </div>
          <div className="flex flex-col px-2 rounded-xl bg-darkBackground  h-[735px] mt-4 justify-between">
            {newsLettersOwned?.length !== 0 && newsLettersOwned ? (
              <section className="my-6">
                <div className="flex items-center justify-between bg-grayStakingLinkHover p-4 rounded-xl">
                  <h2 className="text-2xl">Your Newsletters</h2>
                  <button
                    onClick={() => setOpenModal(true)}
                    className="text-4xl"
                  >
                    +
                  </button>
                </div>
                <div>
                  {newsLettersOwned?.map((newLetter: any, index: number) => {
                    return (
                      <Link href={`/${newLetter.id}`} key={index}>
                        <div className="cardStakingHover my-4 bg-grayStakingLinkHover p-4 rounded-xl text-2xl">
                          {newLetter.title}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ) : (
              <section className="my-6 p-4 rounded-xl">
                <h2 className="text-2xl">Your Library</h2>
                <section className="my-6 bg-grayStakingLinkHover p-4 rounded-xl">
                  <h2 className="text-2xl">Create a Newsletter</h2>
                  <div className="flex justify-center mt-4 flex-col text-start">
                    {eoa !== null ? (
                      <>
                        <p>No newsletters yet! Create your own newsletter</p>
                      </>
                    ) : (
                      <>
                        <p>Need to be connected to create a newsletter</p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    {eoa !== null && (
                      <button
                        className="text-xl border-1 px-4 py-3 rounded-full mt-4 font-semilight"
                        onClick={() => setOpenModal(true)}
                      >
                        Create Newsletter
                      </button>
                    )}
                  </div>
                </section>
              </section>
            )}
            <div className="m-4">
              <div className="flex flex-row items-center">
                <div className="mb-3 p-2 rounded-full border-1 border-white w-fit flex items-center">
                  <ChevronDownIcon
                    className="h-4 w-4 text-white"
                    aria-hidden="true"
                  />
                  <span className="ml-2">Spanish</span>
                </div>
                <div className="font-light text-sm mb-2 ml-2">
                  <span className="mx-2">The team</span>
                  <span className="mx-2">Github</span>
                  <span className="mx-2">Join Discord</span>
                </div>
              </div>
              <div className="my-4 flex justify-between">
                <div className="font-light text-sm">
                  Developed on ETH Global Paris
                </div>
                <div className="flex flex-row">
                  {iconsFooterDark.map((icon: Icon, index: number) => {
                    return (
                      <a href={icon.href} target="_blank" key={index}>
                        <Image
                          width={17}
                          height={17}
                          alt="Token Image"
                          src={icon.img}
                          className="mr-3"
                        />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="lg:min-w-[1288px] col-span-3 px-4 mt-4 bg-darkBackground rounded-xl h-[935px] relative">
          <div className="sticky top-0">
            <NavBar getStatus={getStatus} />
          </div>
          {newsLetter !== undefined ? (
            <div className="h-[790px] overflow-auto pl-10">
              <div className=" bg-darkBackground rounded-xl px-4 mt-4">
                <ImageIpfsDisplay cid={newsLetter.image} />
                <div className="mx-4">
                  <div className="text-4xl flex flex-row justify-between items-center mt-6">
                    <span>{newsLetter.title}</span>
                    <div className="flex flex-row items-center">
                      {!isOnNetwork &&
                        (newsLetter.newsletterOwner.id ===
                        eoa?.toLowerCase() ? (
                          <button
                            onClick={initXmtp}
                            className="px-2 py-2 bg-main rounded-full max-h-[60px] text-sm"
                          >
                            Write Newsletter
                          </button>
                        ) : (
                          newsLetterSuscribed && (
                            <button
                              onClick={initXmtp}
                              className="px-2 py-2 bg-main rounded-full max-h-[60px] text-sm"
                            >
                              Read Newsletter
                            </button>
                          )
                        ))}

                      {newsLetter.newsletterOwner.id !== eoa?.toLowerCase() &&
                        !newsLetterSuscribed && (
                          <div className="flex">
                            <button
                              className="px-2 py-2 bg-main rounded-full max-h-[60px] text-sm ml-10"
                              onClick={() => onCreateNewsLetterClick()}
                            >
                              Subscribe with APE Coin
                            </button>
                            <WalletFund
                              owner={newsLetter.newsletterOwner.id}
                              subscriber={eoa}
                              newsletterNonce={newsLetter.newsletterNonce}
                            />
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="text-sm font-light my-4 flex items-center">
                    <span>{newsLetter.newsletterOwner.id}</span>
                    <CheckBadgeIcon
                      className="h-5 w-5 text-blue-500 ml-2"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="text-lg font-light my-4">
                    {newsLetter.description}
                  </div>
                </div>
              </div>

              {isOnNetwork && messages && eoa.toLowerCase() && (
                <div className="bg-darkBackground rounded-xl px-4 py-8 mt-4">
                  <Chat
                    conversation={convRef.current}
                    messageHistory={messages}
                    newsLetter={newsLetter}
                    subscriptors={subscriptors}
                  />{" "}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full">
              {" "}
              <Image
                src={Logo.Logo1.src}
                height={200}
                width={200}
                alt="Logo Image"
                className="h-full mx-auto my-auto animate-pulse"
              />
            </div>
          )}
        </section>{" "}
        {openModal && <CreateNewsLetterModal getOpenModal={getOpenModal} />}
      </main>
    </>
  );
}
