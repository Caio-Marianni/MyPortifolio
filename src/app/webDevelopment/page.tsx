'use client'

import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import AboutMe from "@/components/about-me";
import Footer from "@/components/footer";
import { ProjectsWebDev } from "@/components/projectsWebDev";

export default function weDevelopmentPage() {
  return (
    <div className="min-h-screen text-foreground">
      <Navbar context="webdev" />
      <main>
        <Hero context="webdev" />
        <AboutMe context="webdev" />
        <ProjectsWebDev />
      </main>
      <Footer />
    </div>
  );
}
