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
    <Link href={`/${title}`} className="cardStakingHover">
      <ImageIpfsDisplay cid={image} />
      <div className="py-8 text-lightText">
        <h1>{title}</h1>
        <p>{description}</p>
        <p>{ethers.utils.formatUnits(price.toString(), "18").toString()} $</p>
      </div>
    </Link>
  );
}

export default NewsLetterCard;
