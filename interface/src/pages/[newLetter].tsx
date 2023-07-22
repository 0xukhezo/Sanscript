import React, { useEffect, useRef, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import WalletFund from "@/components/OnrampSafe/WalletFund";
import Chat from "@/components/Chat/Chat";
import { ethers } from "ethers";
import { client, NewsLetters } from "./api/Newsletters";
import ImageIpfsDisplay from "@/components/ImageIpfsDisplay/ImageIpfsDisplay";
import NavBar from "@/components/Layout/NavBar";
import { useRouter } from "next/router";

let PEER_ADDRESS = "0xB59A5a10E7543AbfBd10D593834AE959f54BCB8C";

export default function NewLetter() {
  const [eoa, setEoa] = useState<string>("");
  const [newsLetter, setNewsLetter] = useState<Object[]>([]);
  const [status, setStatus] = useState<boolean>(false);
  const [messages, setMessages] = useState<any>(null);
  const [writeReadView, setWriteReadView] = useState<boolean>(false);
  const convRef = useRef<any>(null);
  const clientRef = useRef<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [isOnNetwork, setIsOnNetwork] = useState<any>(false);
  const router = useRouter();
  console.log(router.query.newLetter);

  const test = {
    id: "0x01",
    image: "QmeY1hzYDbwKGGbsQbPDX8bsWN8CgCtDnfUeMmpXJaTUea",
    newsletterOwner: "0x31AE9D5A302bAEC5A1c5fBeeB8A1308364BeFC80",
    newsletterNonce: 1,
    title: "Newsletter 1",
    description: "This is newsletter 1",
    pricePerMonth: 1000000000000000000,
    blockNumber: 1000,
    blockTimestamp: 1626342000,
    transactionHash: "0xabcdef1234567890",
  };

  async function fetchNewsLetters(query: string) {
    const queryBody = `  newsletters(where: {title: "${query}"}) {
      id
      image
      description
      pricePerMonth
      title
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
    if (eoa !== test.newsletterOwner) {
      PEER_ADDRESS = test.newsletterOwner;
      addressTo = test.newsletterOwner;
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
    setWriteReadView(true);

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

  return (
    <>
      <NavBar getStatus={getStatus} />
      {writeReadView ? (
        <div className="p-20">
          <button
            className="px-2 py-2 bg-main rounded-lg mb-10"
            onClick={() => setWriteReadView(false)}
          >
            Back to NewsLetter
          </button>
          {isOnNetwork && messages && eoa && (
            <Chat
              conversation={convRef.current}
              messageHistory={messages}
              newsLetter={test}
            />
          )}
        </div>
      ) : (
        <div className="p-20">
          <div className="grid flex-row grid-cols-3">
            <ImageIpfsDisplay cid={test.image} />
            <div className="col-span-2 ml-10">
              <div>{test.title}</div>
              <div>{test.description}</div>
              <div>
                {ethers.utils
                  .formatUnits(test.pricePerMonth.toString(), 18)
                  .toString()}
                USDC
              </div>
              {test.newsletterOwner !== eoa && (
                <div className="flex mt-10">
                  <button className="px-2 py-2 bg-main rounded-lg">
                    Subscribe
                  </button>
                  <WalletFund />
                </div>
              )}
              {!isOnNetwork &&
                !writeReadView &&
                (test.newsletterOwner === eoa ? (
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
        </div>
      )}
    </>
  );
}
