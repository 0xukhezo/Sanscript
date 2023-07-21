import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { newsLettersTest } from "../testNewLetter/testNewLetter";
import { client, NewsLetters } from "./api/Newsletters";

export default function Home() {
  const { address } = useAccount();
  const [newsLetters, setNewsLetters] = useState<Object[]>([]);
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

  useEffect(() => {
    const filteredOwnedNewsLetters = newsLettersTest.filter(
      (newsLetter: any) => newsLetter.newsletterOwner === address
    );

    const filteredOtherNewsLetters = newsLettersTest.filter(
      (newsLetter: any) => newsLetter.newsletterOwner !== address
    );

    setNewsLettersOwned(filteredOwnedNewsLetters);
    setNewsLetters(filteredOtherNewsLetters);
  }, []);

  useEffect(() => {
    const filteredOwnedNewsLetters = newsLettersTest.filter(
      (newsLetter: any) => newsLetter.newsletterOwner === address
    );

    const filteredOtherNewsLetters = newsLettersTest.filter(
      (newsLetter: any) => newsLetter.newsletterOwner !== address
    );

    setNewsLettersOwned(filteredOwnedNewsLetters);
    setNewsLetters(filteredOtherNewsLetters);
  }, [address]);

  return <main>eth paris</main>;
}
