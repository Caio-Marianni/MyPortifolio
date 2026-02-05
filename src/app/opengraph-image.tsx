import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Caio Marianni - Desenvolvedor Front-end";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              background: "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)",
              backgroundClip: "text",
              color: "transparent",
              letterSpacing: "-2px",
            }}
          >
            Caio Marianni
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#9ca3af",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Desenvolvedor Front-end
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            {["React", "Next.js", "TypeScript", "Tailwind"].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: "8px 20px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "20px",
                  color: "#d1d5db",
                  fontSize: 18,
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            color: "#6b7280",
            fontSize: 20,
          }}
        >
          www.caiomarianni.com.br
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
