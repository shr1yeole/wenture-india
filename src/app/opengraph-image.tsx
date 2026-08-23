import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Wenturex India International | Connect. Build. Scale. Grow Together.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
          backgroundColor: "#0A192A",
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(0, 166, 232, 0.25) 0%, rgba(10, 25, 42, 1) 70%)",
          padding: "60px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Brand Badge with Tricolor Accent */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "12px 28px",
            borderRadius: "9999px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            marginBottom: "28px",
          }}
        >
          {/* Ashoka Chakra & Tricolor dot representation */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "9999px", backgroundColor: "#FF8026" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "9999px", backgroundColor: "#FFFFFF" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "9999px", backgroundColor: "#16A34A" }} />
          </div>
          <span
            style={{
              color: "#FFFFFF",
              fontSize: "18px",
              fontWeight: "800",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            WENTURE INDIA INTERNATIONAL
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "64px",
            fontWeight: "900",
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: "1.15",
            marginBottom: "20px",
            letterSpacing: "-0.02em",
          }}
        >
          Connect. Build. Scale.{" "}
          <span style={{ color: "#00A6E8" }}>Grow Together.</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "24px",
            color: "#94A3B8",
            textAlign: "center",
            maxWidth: "900px",
            lineHeight: "1.4",
            marginBottom: "40px",
          }}
        >
          A common online platform to connect entrepreneurs with investors, vision with capital, ideas with funds and giving wings to dreams.
        </p>

        {/* Footer info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "30px",
            fontSize: "18px",
            color: "#64748B",
            fontWeight: "600",
          }}
        >
          <span>https://wentureindia.com</span>
          <span>•</span>
          <span style={{ color: "#00A6E8" }}>Platform Coming Soon</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
