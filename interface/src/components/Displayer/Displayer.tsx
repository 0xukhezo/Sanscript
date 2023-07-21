import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import CreateNewsLetterModal from "../Modal/CreateNewsLetterModal";
import NewsLetterCard from "../NewsLetterCard/NewsLetterCard";

interface DisplayerInterface {
  newsLettersOwned: any;
  newsLettersSubscribed: any;
  newsLetters: any;
}

export default function Displayer({
  newsLettersOwned,
  newsLettersSubscribed,
  newsLetters,
}: DisplayerInterface) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [eoa, setEoa] = useState<string>("");
  const { isConnected } = useAccount();
  const getOpenModal = (modalClose: boolean) => {
    setOpenModal(modalClose);
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
        {newsLettersOwned?.length !== 0 && newsLettersOwned ? (
          <section className="m-10">
            <div className="flex items-center justify-between">
              <h2>Your Newsletters</h2>
              <button
                onClick={() => setOpenModal(true)}
                className="px-2 py-2 bg-main rounded-lg"
              >
                Create Newsletter
              </button>
            </div>

            <div className="grid grid-cols-4 ">
              {newsLettersOwned?.map((newLetter: any, index: number) => {
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
          </section>
        ) : (
          <section className="m-10">
            <h2>Your Newsletters</h2>
            <div className="flex justify-center mt-4 flex-col text-center">
              {isConnected || eoa !== null ? (
                <>
                  <p>Create your own newsletter</p>
                  <button
                    onClick={() => setOpenModal(true)}
                    className="px-2 py-2 bg-main rounded-lg mx-auto mt-6"
                  >
                    Create Newsletter
                  </button>
                </>
              ) : (
                <>
                  <p>Need to be connected to create a newsletter</p>
                  <button
                    onClick={() => setOpenModal(true)}
                    className="px-2 py-2 bg-main rounded-lg mx-auto mt-6 opacity-50"
                    disabled
                  >
                    Create Newsletter
                  </button>
                </>
              )}
            </div>
          </section>
        )}
        {newsLettersSubscribed?.length !== 0 && newsLettersSubscribed && (
          <section className="m-10">
            <h2>Subscribed Newsletters</h2>
            <div className="grid grid-cols-4">
              {newsLettersSubscribed?.map((newLetter: any, index: number) => {
                return (
                  <div
                    key={index}
                    className=" border-2 border-black bg-gray-100 my-8 mr-16 rounded-lg text-center"
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
          <h2> Newsletters</h2>
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
        {openModal && <CreateNewsLetterModal getOpenModal={getOpenModal} />}
      </div>
    </div>
  );
}
