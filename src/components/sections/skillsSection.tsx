"use client";

export function SkillsSection() {
  const skills = {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS"],
    backend: ["Node.js", "Express", "Prisma", "PostgreSQL", "MongoDB"],
    design: ["Figma", "Photoshop", "Illustrator", "Pixel Art", "UI/UX"],
    tools: ["Git", "GitHub", "VS Code", "Vercel", "Docker"]
  };

  return (
    <div className="space-y-4 font-document text-sm text-office-desk">
      <div>
        <h4 className="font-bold text-base mb-3">Technical Skills</h4>
      </div>

      {/* Frontend */}
      <div className="border-t-2 border-passport-tan pt-3">
        <p className="font-bold text-xs mb-2 text-passport-muted">FRONTEND</p>
        <div className="flex flex-wrap gap-2">
          {skills.frontend.map((skill, i) => (
            <span key={i} className="px-2 py-1 bg-stamp-approved/10 border border-stamp-approved text-stamp-approved text-xs font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Backend */}
      <div className="border-t-2 border-passport-tan pt-3">
        <p className="font-bold text-xs mb-2 text-passport-muted">BACKEND</p>
        <div className="flex flex-wrap gap-2">
          {skills.backend.map((skill, i) => (
            <span key={i} className="px-2 py-1 bg-passport-beige border border-passport-tan text-office-desk text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Design */}
      <div className="border-t-2 border-passport-tan pt-3">
        <p className="font-bold text-xs mb-2 text-passport-muted">DESIGN</p>
        <div className="flex flex-wrap gap-2">
          {skills.design.map((skill, i) => (
            <span key={i} className="px-2 py-1 bg-stamp-pending/20 border border-stamp-pending text-stamp-rejected text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div className="border-t-2 border-passport-tan pt-3">
        <p className="font-bold text-xs mb-2 text-passport-muted">TOOLS</p>
        <div className="flex flex-wrap gap-2">
          {skills.tools.map((skill, i) => (
            <span key={i} className="px-2 py-1 bg-office-metal/20 border border-office-metal text-office-desk text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
