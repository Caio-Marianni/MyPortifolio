import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Caio Marianni — Fullstack · Design · Thumbmaker";
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
          backgroundColor: "#050510",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Fuchsia glow — top right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(217,70,239,0.25) 0%, transparent 65%)",
            display: "flex",
          }}
        />

        {/* Cyan glow — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 65%)",
            display: "flex",
          }}
        />

        {/* Vertical accent bar */}
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 72,
            bottom: 72,
            width: 3,
            background:
              "linear-gradient(to bottom, #e879f9, rgba(34,211,238,0.4), transparent)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 104,
            paddingRight: 80,
            gap: 0,
            flex: 1,
          }}
        >
          {/* URL label */}
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 15,
              letterSpacing: 4,
              color: "rgba(103,232,249,0.5)",
              textTransform: "uppercase",
              marginBottom: 32,
              display: "flex",
            }}
          >
            caiomarianni.com.br
          </div>

          {/* Name — line 1 */}
          <div
            style={{
              fontFamily: "serif",
              fontSize: 110,
              fontWeight: 900,
              color: "#e879f9",
              lineHeight: 0.9,
              letterSpacing: -4,
              display: "flex",
            }}
          >
            CAIO
          </div>

          {/* Name — line 2 */}
          <div
            style={{
              fontFamily: "serif",
              fontSize: 110,
              fontWeight: 900,
              color: "#e879f9",
              lineHeight: 0.9,
              letterSpacing: -4,
              marginBottom: 36,
              display: "flex",
            }}
          >
            MARIANNI
          </div>

          {/* Descriptor */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            {["FULLSTACK", "DESIGN", "THUMBMAKER"].map((label, i) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 16,
                    letterSpacing: 5,
                    color: "#67e8f9",
                    textTransform: "uppercase",
                    display: "flex",
                  }}
                >
                  {label}
                </div>
                {i < 2 && (
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      backgroundColor: "rgba(217,70,239,0.6)",
                      display: "flex",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right side decorative grid */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 300,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
            opacity: 0.12,
          }}
        >
          {Array.from({ length: 8 }).map((_, row) => (
            <div key={row} style={{ display: "flex", gap: 16 }}>
              {Array.from({ length: 5 }).map((_, col) => (
                <div
                  key={col}
                  style={{
                    width: 32,
                    height: 32,
                    border: "1px solid #e879f9",
                    borderRadius: 4,
                    display: "flex",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
