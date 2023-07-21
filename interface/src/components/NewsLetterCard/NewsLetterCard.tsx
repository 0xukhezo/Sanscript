import { ethers } from "ethers";
import Link from "next/link";
import React from "react";
import ImageIpfsDisplay from "../ImageIpfsDisplay/ImageIpfsDisplay";

interface NewsLetterCardProps {
  image: string;
  owner: `0x${string}`;
  title: string;
  description: string;
  price: number;
}

function NewsLetterCard({
  image,
  owner,
  title,
  description,
  price,
}: NewsLetterCardProps) {
  return (
    <article
      key={title}
      className="cardStakingHover flex flex-col items-start justify-between z-10"
    >
      {" "}
      <Link href={`/${title}`}>
        <div className="relative w-full">
          <ImageIpfsDisplay cid={image} />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
        </div>
        <div className="max-w-xl text-start px-2">
          <div className="group relative">
            <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
              <span className="absolute inset-0" />
              {title}
            </h3>
            <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
              {description}
            </p>
          </div>
          <div className="relative mt-2 flex items-center gap-x-4">
            <div className="text-sm leading-6">
              <p className="font-semibold text-gray-900">
                {ethers.utils.formatUnits(price.toString(), "18").toString()} $
              </p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default NewsLetterCard;
