import React, { useState, useEffect } from "react";

import NewsLetterCard from "../NewsLetterCard/NewsLetterCard";

interface DisplayerInterface {
  newsLettersSubscribed: any;
  newsLetters: any;
}

export default function Displayer({
  newsLettersSubscribed,
  newsLetters,
}: DisplayerInterface) {
  const [eoa, setEoa] = useState<string>("");

  const shuffleArray = (arr: any[]): any[] => {
    const newArr = Array.from(arr);
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  useEffect(() => {
    setEoa(localStorage.getItem("eoa") as string);
  }, []);

  useEffect(() => {
    setEoa(localStorage.getItem("eoa") as string);
  }, [eoa]);

  return (
    <div>
      <div>
        {newsLettersSubscribed?.length !== 0 && newsLettersSubscribed && (
          <section className="m-10">
            <h2 className="text-4xl">Subscribed Newsletters</h2>
            <div className="flex flex-row overflow-auto max-w-[1200px]">
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
                  className="max-w-[270px] bg-gray-100 my-8 mr-7 rounded-lg text-center"
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
            {shuffleArray(newsLetters).map((newLetter: any, index: number) => {
              return (
                <div
                  key={index}
                  className="max-w-[270px] bg-gray-100 my-8 mr-7 rounded-lg text-center"
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
    </div>
  );
}
