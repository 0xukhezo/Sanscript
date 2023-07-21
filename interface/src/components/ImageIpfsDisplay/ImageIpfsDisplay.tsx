import React, { useEffect, useState } from "react";
import Image from "next/image";
import { create } from "ipfs-http-client";

interface ImageDisplayProps {
  cid: string;
}

export default function ImageDisplay({ cid }: ImageDisplayProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageFromIPFS = async () => {
      try {
        const ipfs = create({
          host: "localhost",
          port: 5001,
          protocol: "http",
        });

        const chunks = [];
        for await (const chunk of ipfs.cat(cid)) {
          chunks.push(chunk);
        }

        const content = new Uint8Array(
          chunks.reduce((acc: any, chunk: any) => [...acc, ...chunk], [])
        );

        const blob = new Blob([content]);
        const src = URL.createObjectURL(blob);
        setImageSrc(src);
      } catch (error) {
        console.error(
          "Error al obtener y mostrar la imagen desde IPFS:",
          error
        );
      }
    };

    fetchImageFromIPFS();
  }, [cid]);

  return (
    <div className=" w-full rounded-2xl bg-gray-100 object-cover z-10">
      {imageSrc ? (
        <Image
          src={imageSrc}
          height={10}
          width={600}
          alt="Newsletter Image"
        ></Image>
      ) : (
        <p>Loading... </p>
      )}
    </div>
  );
}
