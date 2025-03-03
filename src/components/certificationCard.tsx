import React from "react";
import ScrollRevealComponent from "./utils/ScrollReveal";
import { File } from "lucide-react";
import Link from "next/link";
import { Certification } from "../core/types/index";
import { certificationsThumbs, certificationsWebDev } from "../core/constants/index";

type ReviewCardProps = {
  context: "thumbs" | "webdev";
};

export default function CartificationCard({ context }: ReviewCardProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <ScrollRevealComponent />
      {context === "webdev" ? (
        <>
          {certificationsWebDev.map((cert: Certification, index: number) => (
            <Link
              key={index}
              href={cert.doc}
              className="flex gap-1 justify-center items-center shadow-sm py-1 px-2 border rounded-full dark:border-neutral-700 hover:border-black dark:hover:border-white text-xs text-neutral-500 hover:text-black dark:hover:text-white bg-secondary dark:bg-neutral-900 transition-all"
              target="_blank"
            >
              <File size={15} />
              <p>{cert.title}</p>
            </Link>
          ))}
        </>
      ) : (
        <>
          {certificationsThumbs.map((cert: Certification, index: number) => (
            <Link
              key={index}
              href={cert.doc}
              className="flex gap-1 justify-center items-center shadow-sm py-1 px-2 border rounded-full dark:border-neutral-700 hover:border-black dark:hover:border-white text-xs text-neutral-500 hover:text-black dark:hover:text-white bg-secondary dark:bg-neutral-900 transition-all"
              target="_blank"
            >
              <File size={15} />
              <p>{cert.title}</p>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
