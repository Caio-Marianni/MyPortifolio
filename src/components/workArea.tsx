"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { DraggableDocument } from "./draggableDocument";
import { AboutSection } from "./sections/aboutSection";
import { SkillsSection } from "./sections/skillsSection";
import { ProjectsSection } from "./sections/projectsSection";
import { ContactSection } from "./sections/contactSection";

type SectionType = "about" | "skills" | "projects" | "contact";

interface OpenDocument {
  id: string;
  type: SectionType;
  title: string;
  initialX: number;
  initialY: number;
}

export function WorkArea() {
  const [openDocuments, setOpenDocuments] = useState<OpenDocument[]>([]);

  const addDocument = (type: SectionType, title: string) => {
    const exists = openDocuments.find((doc) => doc.type === type);
    if (exists) return;

    const randomX = Math.random() * 300 - 150;
    const randomY = Math.random() * 200 - 100;

    const newDoc: OpenDocument = {
      id: `${type}-${Date.now()}`,
      type,
      title,
      initialX: randomX,
      initialY: randomY,
    };

    const audio = new Audio("/assets/audios/like.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {});

    setOpenDocuments((prev) => [...prev, newDoc]);
  };

  const closeDocument = (id: string) => {
    setOpenDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const renderDocumentContent = (type: SectionType) => {
    switch (type) {
      case "about":
        return <AboutSection />;
      case "skills":
        return <SkillsSection />;
      case "projects":
        return <ProjectsSection />;
      case "contact":
        return <ContactSection />;
      default:
        return null;
    }
  };

  return (
    <div className="w-[70%] relative overflow-hidden">
      {/* Pixel Pattern Background */}
      <div
        className="absolute inset-0 pixel-art"
        style={{
          backgroundColor: "#1a1a1a",
          backgroundImage: `
            radial-gradient(circle, #2a2a2a 1px, transparent 1px),
            radial-gradient(circle, #2a2a2a 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 10px 10px",
        }}
      />

      {/* Main Content Area */}
      <div className="relative h-full flex items-center justify-center p-8">
        {/* Central Passport Card */}
        <div className="paper-texture document-shadow rounded-lg p-8 max-w-md w-full pixel-art border-4 border-passport-tan">
          {/* Passport Header */}
          <div className="border-b-2 border-office-desk pb-4 mb-6">
            <h1 className="font-pixel text-xl text-office-desk pixel-font text-center mb-2">
              PASSPORT
            </h1>
            <p className="font-document text-xs text-passport-muted text-center">
              Developer & Designer
            </p>
          </div>

          {/* Photo + Info */}
          <div className="flex gap-6 mb-6">
            {/* Photo */}
            <div className="w-32 h-40 bg-passport-beige border-2 border-office-desk pixel-art flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-b from-passport-light to-passport-tan flex items-center justify-center">
                <span className="font-pixel text-4xl text-office-desk pixel-font">
                  CM
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3 font-document text-sm">
              <div>
                <span className="font-bold text-office-desk block text-xs">
                  NAME:
                </span>
                <span className="text-passport-tan">Caio Marianni</span>
              </div>
              <div>
                <span className="font-bold text-office-desk block text-xs">
                  DOB:
                </span>
                <span className="text-passport-tan">Unknown</span>
              </div>
              <div>
                <span className="font-bold text-office-desk block text-xs">
                  LOCATION:
                </span>
                <span className="text-passport-tan">
                  Goiânia, GO
                  <br />
                  Brazil
                </span>
              </div>
              <div>
                <span className="font-bold text-office-desk block text-xs">
                  ROLE:
                </span>
                <span className="text-passport-tan">
                  Programmer
                  <br />& Designer
                </span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="border-t-2 border-passport-tan pt-4 mb-6">
            <span className="font-bold text-office-desk block text-xs mb-3 font-document">
              CONTACTS:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button className="px-3 py-2 bg-passport-beige hover:bg-passport-light border border-passport-tan font-document text-xs text-office-desk">
                UpWork
              </button>
              <button className="px-3 py-2 bg-passport-beige hover:bg-passport-light border border-passport-tan font-document text-xs text-office-desk">
                LinkedIn
              </button>
              <button className="px-3 py-2 bg-passport-beige hover:bg-passport-light border border-passport-tan font-document text-xs text-office-desk">
                WhatsApp
              </button>
              <button className="px-3 py-2 bg-passport-beige hover:bg-passport-light border border-passport-tan font-document text-xs text-office-desk">
                Gmail
              </button>
            </div>
          </div>

          {/* Stamp Area */}
          <div className="border-t-2 border-dashed border-passport-tan pt-4">
            <div className="flex justify-center">
              <div className="border-4 border-stamp-approved text-stamp-approved font-stamp text-xl px-6 py-3 rotate-[-15deg] stamp-effect">
                VERIFIED
              </div>
            </div>
          </div>
        </div>

        {/* Tab Icons - Around the passport */}
        <div className="absolute top-20 left-20 flex flex-col gap-4">
          <button
            onClick={() => addDocument("about", "ABOUT ME")}
            className="w-16 h-16 bg-passport-beige hover:bg-passport-light border-2 border-passport-tan pixel-art flex items-center justify-center transition-transform hover:scale-110"
            title="About Me"
          >
            <span className="text-2xl">ℹ️</span>
          </button>
          <button
            onClick={() => addDocument("skills", "SKILLS")}
            className="w-16 h-16 bg-passport-beige hover:bg-passport-light border-2 border-passport-tan pixel-art flex items-center justify-center transition-transform hover:scale-110"
            title="Skills"
          >
            <span className="text-2xl">💻</span>
          </button>
        </div>

        <div className="absolute top-20 right-20 flex flex-col gap-4">
          <button
            onClick={() => addDocument("projects", "PROJECTS")}
            className="w-16 h-16 bg-passport-beige hover:bg-passport-light border-2 border-passport-tan pixel-art flex items-center justify-center transition-transform hover:scale-110"
            title="Projects"
          >
            <span className="text-2xl">🎨</span>
          </button>
          <button
            onClick={() => addDocument("contact", "CONTACT")}
            className="w-16 h-16 bg-passport-beige hover:bg-passport-light border-2 border-passport-tan pixel-art flex items-center justify-center transition-transform hover:scale-110"
            title="Contact"
          >
            <span className="text-2xl">📧</span>
          </button>
        </div>

        {/* Draggable Documents */}
        <AnimatePresence>
          {openDocuments.map((doc) => (
            <DraggableDocument
              key={doc.id}
              title={doc.title}
              onClose={() => closeDocument(doc.id)}
              initialX={doc.initialX}
              initialY={doc.initialY}
            >
              {renderDocumentContent(doc.type)}
            </DraggableDocument>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Action Buttons - Bottom Right */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-3">
        <button className="px-4 py-2 bg-stamp-approved text-passport-paper font-document text-sm border-2 border-stamp-approved hover:bg-stamp-approved/90 pixel-art">
          📥 Download CV
        </button>
        <button className="px-4 py-2 bg-office-desk text-passport-paper font-document text-sm border-2 border-office-metal hover:bg-office-metal pixel-art">
          🌐 EN / PT
        </button>
        <button className="px-4 py-2 bg-passport-tan text-office-desk font-document text-sm border-2 border-passport-beige hover:bg-passport-light pixel-art">
          📂 All Projects
        </button>
      </div>
    </div>
  );
}
