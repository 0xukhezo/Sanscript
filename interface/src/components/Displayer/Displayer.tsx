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
            <div className="grid grid-cols-4">
              {newsLettersSubscribed?.map((newLetter: any, index: number) => {
                return (
                  <div
                    key={index}
                    className=" border-2 border-black bg-gray-100 my-8 rounded-lg text-center"
                  >
                    <NewsLetterCard
                      image={newLetter.image}
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
        <section className="m-10">
          <h2 className="text-4xl"> Newsletters</h2>
          <div className="grid grid-cols-4">
            {newsLetters.map((newLetter: any, index: number) => {
              return (
                <div
                  key={index}
                  className="border-2 border-black bg-gray-100 my-8 mr-16 rounded-lg text-center"
                >
                  <NewsLetterCard
                    image={newLetter.image}
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
