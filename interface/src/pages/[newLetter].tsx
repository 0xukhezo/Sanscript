import React, { useEffect, useRef, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import WalletFund from "@/components/OnrampSafe/WalletFund";
import Chat from "@/components/Chat/Chat";
import { ethers } from "ethers";
import { client, NewsLetters } from "./api/Newsletters";
import ImageIpfsDisplay from "@/components/ImageIpfsDisplay/ImageIpfsDisplay";
import NavBar from "@/components/Layout/NavBar";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

let PEER_ADDRESS = "0xB59A5a10E7543AbfBd10D593834AE959f54BCB8C";

export default function NewLetter() {
  const [eoa, setEoa] = useState<string>("");
  const [newsLetter, setNewsLetter] = useState<Object[]>([]);
  const [newsLetterSuscribed, setNewsLetterSuscribed] = useState<Object[]>([]);
  const [status, setStatus] = useState<boolean>(false);
  const [messages, setMessages] = useState<any>(null);
  const convRef = useRef<any>(null);
  const clientRef = useRef<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [isOnNetwork, setIsOnNetwork] = useState<any>(false);
  const router = useRouter();
  console.log(newsLetterSuscribed);
  const test = {
    id: "0x01",
    image: "QmYfsY8qEdHbvpnwXL25bcyeGpRPLjAKCXAY8hkK5L678x",
    newsletterOwner: { id: "0x31AE9D5A302bAEa5A1c5fBeeB8A1308364BeFC80" },
    newsletterNonce: 1,
    title: "Newsletter 1",
    description:
      "Get the early bird access to the latest updates in the Push Protocol. This is a dummy text: But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.",
    pricePerMonth: 14990000000000000000,
    blockNumber: 1000,
    blockTimestamp: 1626342000,
    transactionHash: "0xabcdef1234567890",
  };

  function decodeJsonString(jsonString: any) {
    const parsedJsonArray = jsonString.map((item: any) => {
      const parsedValue = JSON.parse(item.value);
      return {
        ...item,
        value: parsedValue,
      };
    });

    return parsedJsonArray;
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
      console.log(data.attestations);
      const decodedArray = data.attestations.map((item: any) => {
        console.log(item);
        return decodeJsonString(item.decodedDataJson);
      });

      setNewsLetterSuscribed(decodedArray);
      return data;
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      throw error;
    }
  }

  async function fetchNewsLetters(query: string) {
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
    fetchNewsLetters(router.query.newLetter as string);
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
      <NavBar getStatus={getStatus} />
      <div className="mt-4 mx-8 ">
        <Link className="mb-4 flex items-center text-xl" href="/">
          <ChevronLeftIcon
            className="h-4 w-4 text-white mt-0.5"
            aria-hidden="true"
          />
          <span>Back</span>
        </Link>
        <div className="grid flex-row grid-cols-3 bg-darkBackground rounded-xl px-4 py-8">
          <ImageIpfsDisplay cid={test.image} />
          <div className="col-span-2 ml-10">
            <div className="text-4xl">{test.title}</div>
            <div className="text-sm font-light my-4">
              {test.newsletterOwner.id}
            </div>
            <div className="text-lg font-light my-4">{test.description}</div>
            <div className="text-sm font-light my-4">
              Price:
              <span className="text-main">
                <span className="ml-1.5">$</span>
                <span>
                  {ethers.utils
                    .formatUnits(test.pricePerMonth.toString(), 18)
                    .toString()}
                </span>
                <span className="mx-3">USDC</span>
              </span>
            </div>
            {test.newsletterOwner.id !== eoa && (
              <div className="flex mt-10">
                <button className="px-2 py-2 bg-main rounded-lg">
                  Subscribe
                </button>
                <WalletFund
                  owner={test.newsletterOwner.id}
                  subscriber={eoa}
                  newsletterNonce={test.newsletterNonce}
                />
              </div>
            )}
            {!isOnNetwork &&
              (test.newsletterOwner.id === eoa ? (
                <div>
                  <button
                    onClick={initXmtp}
                    className="px-2 py-2 bg-main rounded-lg"
                  >
                    Write Newsletter
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={initXmtp}
                    className="px-2 py-2 bg-main rounded-lg"
                  >
                    Read Newsletter
                  </button>
                </div>
              ))}
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
    </>
  );
}
