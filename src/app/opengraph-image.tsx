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
        {/* Brand Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 24px",
            borderRadius: "9999px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(0, 166, 232, 0.4)",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "9999px",
              backgroundColor: "#00A6E8",
            }}
          />
          <span
            style={{
              color: "#DFF6FD",
              fontSize: "18px",
              fontWeight: "700",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            WENTUREX INDIA INTERNATIONAL
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
