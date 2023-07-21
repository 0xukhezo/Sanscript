import NavBar from "@/components/Layout/NavBar";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import Displayer from "../components/Displayer/Displayer";
import { newsLettersTest } from "../testNewLetter/testNewLetter";
import { client, NewsLetters } from "./api/Newsletters";
import { HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import CreateNewsLetterModal from "@/components/Modal/CreateNewsLetterModal";
import MediumDark from "../../public/MediumDark.svg";
import GithubDark from "../../public/GithubDark.svg";
import LensDark from "../../public/LensDark.svg";
import TelegramDark from "../../public/TelegramDark.svg";
import TwitterDark from "../../public/TwitterDark.svg";

const twitterImgDark = { TwitterDark };
const githubImgDark = { GithubDark };
const lensImgDark = { LensDark };
const telegramImgDark = { TelegramDark };
const mediumImgDark = { MediumDark };

const iconsFooterDark = [
  {
    img: twitterImgDark.TwitterDark.src,
    href: "https://twitter.com/DragonStake",
  },
  {
    img: githubImgDark.GithubDark.src,
    href: "https://github.com/dragonstake",
  },
  {
    img: lensImgDark.LensDark.src,
    href: "https://lenster.xyz/u/dragonstake",
  },
  {
    img: telegramImgDark.TelegramDark.src,
    href: "https://t.me/DragonStake_Community",
  },
  {
    img: mediumImgDark.MediumDark.src,
    href: "https://medium.com/@dragonstake",
  },
];

type Icon = {
  img: string;
  href: string;
};

export default function Home() {
  const { address } = useAccount();
  const [newsLetters, setNewsLetters] = useState<Object[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);
  const [eoa, setEoa] = useState<string>("");
  const [newsLettersOwned, setNewsLettersOwned] = useState<Object[]>([]);
  const [newsLettersSubscribed, setNewsLettersSubscribed] = useState<Object[]>(
    []
  );

  async function fetchNewsLetters() {
    const queryBody = `query {
      AddedNewsletter {
            id,
            image,
            newsletterOwner,
            newsletterNonce,
            title,
            description,
            pricePerMonth,
            blockNumber,
            blockTimestamp,
            transactionHash
        }
      }`;

    try {
      let response = await client.query({ query: NewsLetters(queryBody) });
      setNewsLetters(response.data.AddedNewsletter);
      // setNewsLettersOwned(
      //   newsLettersTest.filter((newsLetter: any) => {
      //     console.log(newsLetter.newsletterOwner);
      //     newsLetter.newsletterOwner === address;
      //   })
      // );
    } catch (err) {
      console.log({ err });
    }
  }

  const getOpenModal = (modalClose: boolean) => {
    setOpenModal(modalClose);
  };

  const getStatus = (statusNavbar: boolean) => {
    setStatus(statusNavbar);
  };

  useEffect(() => {
    setEoa(localStorage.getItem("eoa") as string);
    const eoa = localStorage.getItem("eoa") as string;

    const filteredOwnedNewsLetters = newsLettersTest.filter(
      (newsLetter: any) => newsLetter.newsletterOwner === eoa
    );

    const filteredOtherNewsLetters = newsLettersTest.filter(
      (newsLetter: any) => newsLetter.newsletterOwner !== eoa
    );

    setNewsLettersOwned(filteredOwnedNewsLetters);
    setNewsLetters(filteredOtherNewsLetters);
  }, []);

  useEffect(() => {
    const filteredOwnedNewsLetters = newsLettersTest.filter(
      (newsLetter: any) => newsLetter.newsletterOwner === eoa
    );

    const filteredOtherNewsLetters = newsLettersTest.filter(
      (newsLetter: any) => newsLetter.newsletterOwner !== eoa
    );

    setNewsLettersOwned(filteredOwnedNewsLetters);
    setNewsLetters(filteredOtherNewsLetters);
  }, [eoa]);

  useEffect(() => {
    const filteredOwnedNewsLetters = newsLettersTest.filter(
      (newsLetter: any) => newsLetter.newsletterOwner === eoa
    );

    const filteredOtherNewsLetters = newsLettersTest.filter(
      (newsLetter: any) => newsLetter.newsletterOwner !== eoa
    );

    setNewsLettersOwned(filteredOwnedNewsLetters);
    setNewsLetters(filteredOtherNewsLetters);
  }, [address]);

  useEffect(() => {
    setEoa(localStorage.getItem("eoa") as string);
  }, [status]);
  console.log(eoa, newsLettersOwned);
  return (
    <main className="grid lg:grid-cols-4 lg:max-w-[1668px]">
      <section className="lg:max-w-[520px] col-span-1 mx-4 mt-4">
        <div className="flex flex-col justify-between bg-darkBackground h-[184px] rounded-xl">
          <div className="flex flex-col mx-6">
            <Link className="lg:text-lg flex my-4" href="/">
              <HomeIcon
                className="h-6 w-6 text-white mr-2"
                aria-hidden="true"
              />
              <span>Sanscript</span>
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
                className="h-6 w-6 text-white mr-2"
                aria-hidden="true"
              />
              <span>Search Newsletters</span>
            </div>{" "}
          </div>
        </div>
        <div className="flex flex-col px-2 rounded-xl bg-darkBackground  h-[735px] mt-4">
          {newsLettersOwned?.length !== 0 && newsLettersOwned ? (
            <section className="my-6">
              <div className="flex items-center justify-between bg-grayStakingLinkHover p-4 rounded-xl">
                <h2 className="text-2xl">Your Newsletters</h2>
                <button onClick={() => setOpenModal(true)} className="text-4xl">
                  +
                </button>
              </div>
              <div className="my-4 bg-grayStakingLinkHover p-4 rounded-xl">
                {newsLettersOwned?.map((newLetter: any, index: number) => {
                  return (
                    <Link
                      href={`/${newLetter.title}`}
                      className="text-2xl"
                      key={index}
                    >
                      <div>{newLetter.title}</div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className="my-6 bg-grayStakingLinkHover p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl">Your Newsletters</h2>
                {eoa !== null && <button className="text-4xl">+</button>}
              </div>
              <div className="flex justify-center mt-4 flex-col text-center">
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
            </section>
          )}
        </div>
      </section>
      <section className="lg:min-w-[1288px] col-span-3 mx-4 mt-4 bg-darkBackground rounded-xl h-[935px]  relative">
        <div className="sticky top-0">
          <NavBar getStatus={getStatus} />
        </div>
        <div className="h-[790px] overflow-auto ml-10">
          {newsLetters && newsLettersSubscribed && newsLettersOwned ? (
            <Displayer
              newsLetters={newsLetters}
              newsLettersSubscribed={newsLettersSubscribed}
            />
          ) : (
            <div>Loading...</div>
          )}
        </div>
        <div className="mx-20 my-4 flex justify-between">
          <div className="font-bold">Developed on ETH Global Paris</div>
          <div className="flex flex-row">
            {iconsFooterDark.map((icon: Icon, index: number) => {
              return (
                <a href={icon.href} target="_blank" key={index}>
                  <Image
                    width={24}
                    height={24}
                    alt="Token Image"
                    src={icon.img}
                    className="mr-9 mb-10 z-10"
                  />
                </a>
              );
            })}
          </div>
        </div>
      </section>{" "}
      {openModal && <CreateNewsLetterModal getOpenModal={getOpenModal} />}
    </main>
  );
}
