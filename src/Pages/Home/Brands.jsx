import * as React from "react";
import { Box, Typography, Stack } from "@mui/material";

// ---- Design tokens -------------------------------------------------------
// Warm linen background (not stark white, not the stock cream-#F4F1EA combo)
// paired with a muted copper accent and brass for secondary marks.
const COLORS = {
  bg: "#F7F7F7",
  bgDot: "rgba(0,0,0,0.05)",
  card: "#FFFFFF",
  ink: "#000000",
  inkSoft: "rgba(0,0,0,0.62)",
  inkFaint: "rgba(0,0,0,0.38)",
  line: "rgba(0,0,0,0.10)",
  lineSoft: "rgba(0,0,0,0.06)",
  copper: "#BC0507",
  copperSoft: "rgba(188,5,7,0.10)",
  brass: "#8F0002",
};

const BRANDS = [
  { name: "Aldern & Co.", category: "Furniture", since: "1987" },
  { name: "Wescott", category: "Apparel", since: "2003" },
  { name: "Marlowe", category: "Stationery", since: "1994" },
  { name: "Field & Fray", category: "Outdoor", since: "2011" },
  { name: "Ondine", category: "Skincare", since: "2016" },
  { name: "Northgate", category: "Homeware", since: "1978" },
  { name: "Loom House", category: "Textiles", since: "1999" },
  { name: "Verity", category: "Eyewear", since: "2009" },
];

function ArrowGlyph({ size = 13, color = COLORS.ink }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17L17 7M17 7H8M17 7V16"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Mark({ letter }) {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "10px",
        bgcolor: COLORS.copperSoft,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "background-color 0.25s ease",
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Fraunces', serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 18,
          color: COLORS.copper,
          lineHeight: 1,
        }}
      >
        {letter}
      </Typography>
    </Box>
  );
}

function BrandCard({ brand }) {
  return (
    <Box
      role="link"
      tabIndex={0}
      sx={{
        position: "relative",
        bgcolor: COLORS.card,
        border: `1px solid ${COLORS.line}`,
        borderRadius: "16px",
        p: "24px",
        cursor: "pointer",
        overflow: "hidden",
        transition: "transform 0.28s cubic-bezier(.2,.8,.2,1), box-shadow 0.28s ease, border-color 0.28s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: "rgba(178,78,41,0.35)",
          boxShadow: "0 18px 36px -22px rgba(33,31,26,0.35)",
        },
        "&:hover .brand-arrow": {
          opacity: 1,
          transform: "translate(0,0)",
        },
        "&:focus-visible": {
          outline: `2px solid ${COLORS.copper}`,
          outlineOffset: "2px",
        },
        // top accent hairline that fills in on hover
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, ${COLORS.copper}, ${COLORS.brass})`,
          transform: "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.35s ease",
        },
        "&:hover::before": {
          transform: "scaleX(1)",
        },
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: "18px" }}>
        <Mark letter={brand.name.charAt(0)} />
        <Box
          className="brand-arrow"
          sx={{
            opacity: 0,
            transform: "translate(-4px,4px)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
            mt: "4px",
          }}
        >
          <ArrowGlyph color={COLORS.copper} />
        </Box>
      </Stack>

      <Typography
        sx={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 600,
          fontSize: 21,
          color: COLORS.ink,
          letterSpacing: "-0.01em",
          lineHeight: 1.15,
          mb: "6px",
        }}
      >
        {brand.name}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: COLORS.inkSoft,
          }}
        >
          {brand.category}
        </Typography>
        <Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: COLORS.inkFaint }} />
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12.5,
            color: COLORS.inkFaint,
          }}
        >
          Since {brand.since}
        </Typography>
      </Stack>
    </Box>
  );
}

export default function BrandsSection() {
  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        bgcolor: COLORS.bg,
        py: "80px",
        backgroundImage: `radial-gradient(${COLORS.bgDot} 1px, transparent 1px)`,
        backgroundSize: "22px 22px",
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", px: "5%" }}>
        {/* heading */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "flex-end" }}
          justifyContent="space-between"
          spacing={3}
          sx={{ mb: "44px" }}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: "16px" }}>
              <Typography
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: COLORS.copper,
                }}
              >
                Trusted By
              </Typography>
            </Stack>
            <Typography
              sx={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                color: COLORS.ink,
                fontSize: "clamp(30px, 3.4vw, 46px)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              Brands worth{" "}
              <Box component="em" sx={{ fontWeight: 500, color: COLORS.copper }}>
                the shelf space
              </Box>
            </Typography>
          </Box>
        </Stack>

        {/* card grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: "16px",
          }}
        >
          {BRANDS.map((brand) => (
            <BrandCard key={brand.name} brand={brand} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}