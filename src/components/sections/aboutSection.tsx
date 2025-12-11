"use client";

export function AboutSection() {
  return (
    <div className="space-y-4 font-document text-sm text-office-desk">
      <div>
        <h4 className="font-bold text-base mb-2">About Me</h4>
        <p className="text-passport-tan leading-relaxed">
          Full Stack Developer and Designer with passion for creating unique digital experiences.
          Specialized in web development, UI/UX design, and pixel art.
        </p>
      </div>

      <div className="border-t-2 border-passport-tan pt-4">
        <h4 className="font-bold text-base mb-2">Experience</h4>
        <div className="space-y-3">
          <div>
            <p className="font-bold">Freelance Developer & Designer</p>
            <p className="text-xs text-passport-muted">2020 - Present</p>
            <p className="text-passport-tan text-xs mt-1">
              Creating custom websites, landing pages, and design solutions for clients worldwide.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-passport-tan pt-4">
        <h4 className="font-bold text-base mb-2">Interests</h4>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-passport-beige border border-passport-tan text-xs">Gaming</span>
          <span className="px-2 py-1 bg-passport-beige border border-passport-tan text-xs">Pixel Art</span>
          <span className="px-2 py-1 bg-passport-beige border border-passport-tan text-xs">UI Design</span>
          <span className="px-2 py-1 bg-passport-beige border border-passport-tan text-xs">Animation</span>
        </div>
      </div>
    </div>
  );
}
