import NavBar from "@/components/Layout/NavBar";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import Displayer from "../components/Displayer/Displayer";
import { client, NewsLetters } from "./api/Newsletters";
import { HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import CreateNewsLetterModal from "@/components/Modal/CreateNewsLetterModal";
import MediumDark from "../../public/MediumDark.svg";
import GithubDark from "../../public/GithubDark.svg";
import LensDark from "../../public/LensDark.svg";
import TwitterDark from "../../public/TwitterDark.svg";
import Logo1 from "../../public/Logo.svg";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import ImageIpfsDisplay from "@/components/ImageIpfsDisplay/ImageIpfsDisplay";
import { AllNewsletterQueryDocument, execute } from "../../.graphclient";
import gql from "graphql-tag";

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

export default function Home() {
  const [newsLetters, setNewsLetters] = useState<Object[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);
  const [eoa, setEoa] = useState<string>("");
  const [newsLettersOwned, setNewsLettersOwned] = useState<Object[]>([]);
  const [newsLettersSubscribed, setNewsLettersSubscribed] = useState<Object[]>(
    []
  );

  async function fetchNewsLetters() {
    let response = await execute(AllNewsletterQueryDocument, {});

    for await (const value of response) {
      setNewsLetters(value.data?.newsletters);
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setNewsLettersOwned(
      newsLetters.filter((newsLetter: any) => {
        return newsLetter.newsletterOwner.id === accounts[0].toLowerCase();
      })
    );
  }

  const getOpenModal = (modalClose: boolean) => {
    setOpenModal(modalClose);
  };

  const getStatus = (statusNavbar: boolean) => {
    setStatus(statusNavbar);
  };

  const getFilteres = () => {
    const eoa = localStorage.getItem("eoa") as string;
    const filteredOwnedNewsLetters = newsLetters?.filter(
      (newsLetter: any) => newsLetter.newsletterOwner.id === eoa
    );

    const filteredOtherNewsLetters = newsLetters?.filter(
      (newsLetter: any) => newsLetter.newsletterOwner.id !== eoa
    );

    setNewsLettersOwned(filteredOwnedNewsLetters);
    setNewsLetters(filteredOtherNewsLetters);
    setNewsLettersOwned(
      newsLetters?.filter((newsLetter: any) => {
        return newsLetter.newsletterOwner.id === eoa?.toLowerCase();
      })
    );
  };

  useEffect(() => {
    setEoa(localStorage.getItem("eoa") as string);
    fetchNewsLetters();
    getFilteres();
  }, []);

  useEffect(() => {
    getFilteres();
    fetchNewsLetters();
  }, [eoa, status]);

  useEffect(() => {
    if (status) {
      setEoa(localStorage.getItem("eoa") as string);
    } else {
      setEoa(localStorage.getItem("eoa") as string);
    }
  }, [status]);

  return (
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
                className="h-6 w-6 text-white mr-2"
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
                <button onClick={() => setOpenModal(true)} className="text-4xl">
                  +
                </button>
              </div>
              <div>
                {newsLettersOwned?.map((newLetter: any, index: number) => {
                  return (
                    <Link href={`/${newLetter.id}`} key={index}>
                      <div className="cardStakingHover my-4 bg-grayStakingLinkHover p-4 rounded-xl text-2xl flex">
                        <span>{newLetter.title}</span>
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
      <section className="lg:min-w-[1288px] col-span-3 mx-4 mt-4 bg-darkBackground rounded-xl h-[935px] relative">
        <div className="sticky top-0">
          <NavBar getStatus={getStatus} />
        </div>
        <div className="h-[790px]  mx-10">
          {newsLetters && newsLettersSubscribed ? (
            <Displayer
              newsLetters={newsLetters}
              newsLettersSubscribed={newsLettersSubscribed}
            />
          ) : (
            <div className="h-[790px]">
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
        </div>
      </section>{" "}
      {openModal && <CreateNewsLetterModal getOpenModal={getOpenModal} />}
    </main>
  );
}
