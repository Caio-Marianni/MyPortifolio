"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Hero } from "@/components/home/hero";
import { StatusSection } from "@/components/home/status-section";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-white dark:bg-black text-black dark:text-purple-200 relative overflow-hidden transition-colors duration-300">
      {/* Noise Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60 dark:bg-blue-500/10"
        style={{ backgroundImage: "url('/assets/images/noise.webp')", backgroundRepeat: "repeat" }}
      />

      {/* Background */}
      {/* <div className="absolute bottom-0 right-0 pointer-events-none"> */}
      <div className="absolute bottom-0 -right-64 xl:right-20 rotate-[24deg] pointer-events-none z-10">
        <Image
          src="/assets/images/Dg.png"
          width={600}
          height={600}
          alt="Background"
          className="block dark:hidden"
        />
        <Image
          src="/assets/images/DgUv.png"
          width={600}
          height={600}
          alt="Background"
          className="hidden dark:block"
        />
      </div>

      {/* Theme Toggle Button */}
      <ThemeToggle />

      {/* Logo */}
      <div className="absolute top-8 left-6 z-10">
        <Image src="/Logo.svg" width={60} height={60} alt="Signature" />
      </div>

      {/* Content */}
      <div className="max-h-[60%] max-w-[100%] lg:max-w-[60%] px-6 z-50">
        <Hero />
        <StatusSection />
      </div>
    </main>
  );
}
