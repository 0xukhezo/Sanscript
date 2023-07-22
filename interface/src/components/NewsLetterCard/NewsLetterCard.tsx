import { ethers } from "ethers";
import Link from "next/link";
import React from "react";
import ImageIpfsDisplay from "../ImageIpfsDisplay/ImageIpfsDisplay";

interface NewsLetterCardProps {
  image: string;
  owner: `0x${string}`;
  title: string;
  id: string;
  description: string;
  price: number;
}

function NewsLetterCard({
  image,
  owner,
  id,
  title,
  description,
  price,
}: NewsLetterCardProps) {
  return (
    <article key={id} className="cardStakingHover rounded-lg relative">
      <Link href={`/${id}`}>
        {" "}
        <p className="text-main absolute top-0 right-0 mr-3 mt-1 font-extrelight text-sm bg-cardGradientDark px-2 rounded-full">
          <span className="mr-0.5">$</span>{" "}
          <span>
            {ethers.utils.formatUnits(price.toString(), "18").toString()}
          </span>
        </p>
        <ImageIpfsDisplay cid={image} />
        <div className="bg-cardGradientDark text-start px-4 rounded-b-lg">
          <div className="group relative">
            <h3 className="pt-4 text-lg font-semibold leading-6">
              <span className="absolute inset-0 text-white font-medium" />
              {title}
            </h3>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400 font-light">
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
