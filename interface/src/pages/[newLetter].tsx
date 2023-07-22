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
  ChevronLeftIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import MediumDark from "../../public/MediumDark.svg";
import GithubDark from "../../public/GithubDark.svg";
import Logo1 from "../../public/Logo.svg";
import LensDark from "../../public/LensDark.svg";
import TwitterDark from "../../public/TwitterDark.svg";
import CreateNewsLetterModal from "@/components/Modal/CreateNewsLetterModal";

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

let PEER_ADDRESS = "0xB59A5a10E7543AbfBd10D593834AE959f54BCB8C";

export default function NewLetter() {
  const [eoa, setEoa] = useState<string>("");
  const [newsLetter, setNewsLetter] = useState<Object[]>([]);
  const [newsLettersOwned, setNewsLettersOwned] = useState<Object[]>([]);
  const [newsLetterSuscribed, setNewsLetterSuscribed] = useState<Object[]>([]);
  const [status, setStatus] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [messages, setMessages] = useState<any>(null);
  const convRef = useRef<any>(null);
  const clientRef = useRef<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [isOnNetwork, setIsOnNetwork] = useState<any>(false);
  const router = useRouter();

  const test = {
    id: "0x01",
    image: "QmYfsY8qEdHbvpnwXL25bcyeGpRPLjAKCXAY8hkK5L678x",
    newsletterOwner: { id: "0x31AE9D5A302bAEa5A1c5fBeeB8A1308364BeFC80" },
    newsletterNonce: 1,
    title: "Push Protocol",
    description:
      "Get the early bird access to the latest updates in the Push Protocol. This is a dummy text: But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.",
    pricePerMonth: 14990000000000000000,
    blockNumber: 1000,
    blockTimestamp: 1626342000,
    transactionHash: "0xabcdef1234567890",
  };

  function parseDecodedData(decodedData: any) {
    return JSON.parse(decodedData);
  }

  function extractAndTransformValueObject(item: any) {
    return item.decodedDataJson.reduce((result: any, decodedItem: any) => {
      if (decodedItem.value && decodedItem.value.value !== undefined) {
        result[decodedItem.name] = decodedItem.value.value;
      }
      return result;
    }, {});
  }

  async function fetchNewsletterByAddress() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const apiUrl = `http://localhost:3001/api/v1/newsletter/${ethers.utils.getAddress(
      accounts[0]
    )}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("No se pudo obtener la respuesta del servidor.");
      }

      const data = await response.json();

      const newArray = data.attestations.map((item: any) => {
        return {
          decodedDataJson: [parseDecodedData(item.decodedDataJson)],
        };
      });
      console.log(newArray[0]);
      const transformedArray = newArray.map((item: any) =>
        extractAndTransformValueObject(item)
      );
      console.log(transformedArray);
      setNewsLetterSuscribed(transformedArray);
      return data;
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      throw error;
    }
  }

  async function fetchNewsLetter(query: string) {
    const queryBody = `newsletters(where: {title: "${query}"}) {
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
      console.log(response.data.newsletters);
      setNewsLetter(response.data.newsletters);
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

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setNewsLettersOwned(
        response.data.newsletters.filter((newsLetter: any) => {
          return newsLetter.newsletterOwner.id === accounts[0].toLowerCase();
        })
      );
    } catch (err) {
      console.log({ err });
    }
  }

  const newConversation = async function (xmtp_client: any, addressTo: any) {
    if (eoa !== test.newsletterOwner.id) {
      PEER_ADDRESS = test.newsletterOwner.id;
      addressTo = test.newsletterOwner.id;
    }
    if (await xmtp_client?.canMessage(PEER_ADDRESS)) {
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

    newConversation(xmtp, PEER_ADDRESS);

    setIsOnNetwork(!!xmtp.address);

    clientRef.current = xmtp;
  };

  useEffect(() => {
    fetchNewsLetters();
    fetchNewsLetter(router.query.newLetter as string);
    setEoa(localStorage.getItem("eoa") as string);
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
    fetchNewsletterByAddress();
  }, []);

  useEffect(() => {
    fetchNewsLetters(router.query.newLetter as string);
  }, [router]);

  const getStatus = (statusNavbar: boolean) => {
    setStatus(statusNavbar);
  };

  const getOpenModal = (modalClose: boolean) => {
    setOpenModal(modalClose);
  };

  useEffect(() => {
    setEoa(localStorage.getItem("eoa") as string);
  }, [eoa]);

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
    setEoa(localStorage.getItem("eoa") as string);
  }, []);

  useEffect(() => {
    setEoa(localStorage.getItem("eoa") as string);
  }, [eoa]);

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
                      <Link href={`/${newLetter.title}`} key={index}>
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
          <div className="h-[790px] overflow-auto pl-10">
            <div className=" bg-darkBackground rounded-xl px-4 mt-4">
              <ImageIpfsDisplay cid={test.image} />
              <div className="mx-4">
                <div className="text-4xl flex flex-row justify-between items-center mt-6">
                  <span>{test.title}</span>
                  <div className="flex flex-row items-center">
                    {!isOnNetwork &&
                      (test.newsletterOwner.id === eoa ? (
                        <button
                          onClick={initXmtp}
                          className="px-2 py-2 bg-main rounded-full max-h-[30px] text-sm"
                        >
                          Write Newsletter
                        </button>
                      ) : (
                        <button
                          onClick={initXmtp}
                          className="px-2 py-2 bg-main rounded-full max-h-[60px] text-sm"
                        >
                          Read Newsletter
                        </button>
                      ))}
                    {test.newsletterOwner.id !== eoa && (
                      <div className="flex">
                        <button className="px-2 py-2 bg-main rounded-full max-h-[60px] text-sm ml-10">
                          Subscribe with USDC
                        </button>
                        <WalletFund
                          owner={test.newsletterOwner.id}
                          subscriber={eoa}
                          newsletterNonce={test.newsletterNonce}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm font-light my-4">
                  {test.newsletterOwner.id}
                </div>
                <div className="text-lg font-light my-4">
                  {test.description}
                </div>
              </div>
            </div>

            {isOnNetwork && messages && eoa && (
              <div className="bg-darkBackground rounded-xl px-4 py-8 mt-4">
                <Chat
                  conversation={convRef.current}
                  messageHistory={messages}
                  newsLetter={test}
                />{" "}
              </div>
            )}
          </div>
        </section>{" "}
        {openModal && <CreateNewsLetterModal getOpenModal={getOpenModal} />}
      </main>
    </>
  );
}
