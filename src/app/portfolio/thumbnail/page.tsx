"use client";

import Thumbnails from "@/components/thumbnails";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";

export default function ThumbnailsPage() {
  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="relative container w-full flex h-14 px-4 md:px-10 items-center justify-center">
          <Link className="mr-6 flex items-center space-x-2" rel="noopener noreferrer" aria-label="Home" href="#hero">
            <Image src="/assets/images/LogoOrange.webp" width={40} height={40} alt="Background person" priority />
          </Link>
        </div>
      </header>
      <main>
        <Thumbnails />
      </main>
      <Footer />
    </div>
  );
}
