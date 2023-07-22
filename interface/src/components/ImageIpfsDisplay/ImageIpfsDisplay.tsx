import React, { useEffect, useState } from "react";
import Image from "next/image";
import { create } from "ipfs-http-client";
import { useRouter } from "next/router";

interface ImageDisplayProps {
  cid: string;
}

export default function ImageDisplay({ cid }: ImageDisplayProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const router = useRouter();

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
    <div className="">
      {imageSrc ? (
        <Image
          src={imageSrc}
          height={router.route !== "/" ? 400 : 205}
          width={router.route !== "/" ? 400 : 1000}
          alt="Newsletter Image"
          className={
            router.route !== "/"
              ? "object-cover w-[1168px] h-[229px]"
              : "object-cover w-[300px] h-[135px] rounded-t-lg"
          }
        />
      ) : (
        <p>Loading... </p>
      )}
    </div>
  );
}
