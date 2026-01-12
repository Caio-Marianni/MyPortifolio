import { MapPin, CloudSnow, Gamepad2, Music } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="relative max-w-3xl mx-auto px-6 py-20 md:py-32">
        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
          Making your ideas click
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base font-mono tracking-wider mb-12 text-gray-400">
          JHEY TOMPKINS - STAFF DESIGN ENGINEER @ SHOPIFY
        </p>

        {/* Description */}
        <div className="text-lg md:text-xl mb-12 leading-relaxed">
          <p className="mb-6">
            I craft <span className="text-red-500 font-semibold">UI demos</span> that explore the power of the web and help others sharpen their skills. People{" "}
            <span className="text-red-500 font-semibold">know me for</span> turning complex UI challenges into approachable solutions — the kind that make you say, "Wait, how did you do that?"
          </p>
          <p className="text-gray-400 italic">
            — Follow along on <span className="text-red-500 not-italic">the internet</span>.
          </p>
        </div>

        {/* Signature */}
        <div className="mb-16">
          <svg
            viewBox="0 0 200 120"
            className="w-48 h-auto"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 20,80 Q 30,20 50,60 T 80,80" />
            <path d="M 50,40 Q 60,80 80,50" />
            <path d="M 90,40 L 90,90 M 90,60 Q 110,40 120,60 Q 130,80 120,90" />
            <path d="M 130,50 Q 150,30 160,60 L 160,90 Q 170,70 180,90" />
            <ellipse cx="170" cy="75" rx="20" ry="25" fill="white" opacity="0.1" />
          </svg>
        </div>

        {/* Status Section */}
        <div className="space-y-4 text-base md:text-lg font-mono">
          {/* Location */}
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="tracking-wide">CHILLIN' IN BEDFORD</span>
          </div>

          {/* Weather/Time */}
          <div className="flex items-center gap-3">
            <CloudSnow className="w-5 h-5 text-gray-400" />
            <span className="tracking-wide">30.4°F • 08:02</span>
          </div>

          {/* Current Activity - Game */}
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-5 h-5 text-gray-400" />
            <a
              href="#"
              className="text-red-500 hover:text-red-400 transition-colors tracking-wide"
            >
              MIRRORED SIGNATURE FLOW
            </a>
          </div>

          {/* Gaming */}
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-5 h-5 text-gray-400" />
            <a
              href="#"
              className="text-red-500 hover:text-red-400 transition-colors tracking-wide"
            >
              DEATH STRANDING DIRECTOR'S CUT
            </a>
          </div>

          {/* Music */}
          <div className="flex items-center gap-3">
            <Music className="w-5 h-5 text-gray-400" />
            <a
              href="#"
              className="text-red-500 hover:text-red-400 transition-colors tracking-wide"
            >
              EGG MAN, BEASTIE BOYS
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
