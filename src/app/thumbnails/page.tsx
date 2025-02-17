'use client'

import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import AboutMe from "@/components/about-me";
import Thumbnails from "@/components/thumbnails";
import Footer from "@/components/footer";

export default function ThumbnailsPage() {
  return (
    <div className="min-h-screen text-foreground">
      <Navbar context="thumbs" />
      <main>
        <Hero context="thumbs" />
        <AboutMe context="thumbs" />
        <Thumbnails />
      </main>
      <Footer />
    </div>
  );
}
