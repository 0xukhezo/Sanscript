import React, { useState, useEffect } from "react";
import Logo1 from "../../../public/Logo.svg";
import NewsLetterCard from "../NewsLetterCard/NewsLetterCard";
import Image from "next/image";

const Logo = { Logo1 };

interface DisplayerInterface {
  newsLettersSubscribed: any;
  newsLetters: any;
}

export default function Displayer({
  newsLettersSubscribed,
  newsLetters,
}: DisplayerInterface) {
  const [eoa, setEoa] = useState<string>("");

  useEffect(() => {
    setEoa(localStorage.getItem("eoa") as string);
  }, []);

  useEffect(() => {
    setEoa(localStorage.getItem("eoa") as string);
  }, [eoa]);

  return (
    <div>
      {newsLetters.length > 0 ? (
        <div>
          {newsLettersSubscribed?.length !== 0 && newsLettersSubscribed && (
            <section className="m-10">
              <h2 className="text-4xl">Subscribed Newsletters</h2>
              <div className="flex flex-row overflow-auto w-[1200px]">
                {newsLettersSubscribed?.map((newLetter: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="min-w-[270px] bg-gray-100 my-8 mr-7 rounded-lg text-center"
                    >
                      <NewsLetterCard
                        image={newLetter.image}
                        id={newLetter.id}
                        owner={newLetter.newsletterOwner}
                        title={newLetter.title}
                        description={newLetter.description}
                        price={newLetter.pricePerMonth}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          )}{" "}
          <section className="mx-10 mt-4">
            <h2 className="text-4xl">The most followed</h2>
            <div className="flex flex-row overflow-auto max-w-[1200px]">
              {newsLetters.map((newLetter: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="min-w-[270px] bg-gray-100 my-8 mr-7 rounded-lg text-center"
                  >
                    <NewsLetterCard
                      image={newLetter.image}
                      id={newLetter.id}
                      owner={newLetter.newsletterOwner}
                      title={newLetter.title}
                      description={newLetter.description}
                      price={newLetter.pricePerMonth}
                    />
                  </div>
                );
              })}
            </div>
          </section>
          <section className="mx-10 mb-10 mt-4">
            <h2 className="text-4xl">Oldies but goodies</h2>
            <div className="flex flex-row overflow-auto max-w-[1200px]">
              {newsLetters.map((newLetter: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="min-w-[270px] bg-gray-100 my-8 mr-7 rounded-lg text-center"
                  >
                    <NewsLetterCard
                      image={newLetter.image}
                      id={newLetter.id}
                      owner={newLetter.newsletterOwner}
                      title={newLetter.title}
                      description={newLetter.description}
                      price={newLetter.pricePerMonth}
                    />
                  </div>
                );
              })}
            </div>
          </section>{" "}
        </div>
      ) : (
        <div className="h-[790px]">
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
  );
}
