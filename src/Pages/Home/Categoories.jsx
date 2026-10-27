import * as React from "react";
import { Box, Typography, Stack } from "@mui/material";

const COLORS = {
  umber: "#151515",
  sienna: "#BC0507",
  sand: "#F7F7F7",
  sandDeep: "#C0C0C0",
  olive: "#8F0002",
  gold: "#BC0507",
  ink: "#000000",
};

// `area` maps each card to a named cell in the desktop grid template below.
// `radius` gives each card its own asymmetric corner treatment (the "unique corner" look).
// Swap `image` for a real photo URL to replace the gradient placeholder.
const CATEGORIES = [
  {
    name: "Outerwear",
    count: "128 pieces",
    area: "large",
    gradient: `linear-gradient(160deg, #4A2E1E 0%, ${COLORS.umber} 55%, ${COLORS.sienna} 145%)`,
    image: null,
    radius: "28px 90px 28px 28px",
  },
  {
    name: "Knitwear",
    count: "64 pieces",
    area: "a",
    gradient: `linear-gradient(160deg, ${COLORS.olive} 0%, #37392A 100%)`,
    image: null,
    radius: "60px 20px 20px 20px",
  },
  {
    name: "Footwear",
    count: "42 pieces",
    area: "b",
    gradient: `linear-gradient(160deg, ${COLORS.gold} 0%, #97722A 100%)`,
    image: null,
    radius: "20px 60px 20px 20px",
  },
  {
    name: "Accessories",
    count: "91 pieces",
    area: "c",
    gradient: `linear-gradient(160deg, #8A5A3C 0%, ${COLORS.umber} 100%)`,
    image: null,
    radius: "20px 20px 20px 60px",
  },
  {
    name: "Denim",
    count: "37 pieces",
    area: "d",
    gradient: `linear-gradient(160deg, #4C5A6B 0%, #202730 100%)`,
    image: null,
    radius: "20px 20px 60px 20px",
  },
];

// Arrow drawn inline so the component has no icon-package dependency.
function ArrowGlyph({ size = 18, color = COLORS.sand }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17L17 7M17 7H8M17 7V16" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CategoryCard({ category }) {
  const isLarge = category.area === "large";

  return (
    <Box
      role="link"
      tabIndex={0}
      sx={{
        gridArea: category.area,
        position: "relative",
        borderRadius: category.radius,
        overflow: "hidden",
        cursor: "pointer",
        background: category.image ? `url(${category.image}) center / cover no-repeat` : category.gradient,
        display: "flex",
        alignItems: "flex-end",
        isolation: "isolate",
        transition: "transform 0.35s cubic-bezier(.2,.9,.3,1), box-shadow 0.35s ease",
        boxShadow: "0 1px 2px rgba(28,17,11,0.08)",
        "&:hover, &:focus-visible": {
          transform: "translateY(-5px)",
          boxShadow: "0 26px 44px -20px rgba(28,17,11,0.5)",
        },
        "&:hover .cat-arrow, &:focus-visible .cat-arrow": {
          transform: "translate(3px, -3px)",
          bgcolor: COLORS.sienna,
        },
        "&:hover .cat-mark, &:focus-visible .cat-mark": {
          transform: "translateY(-6px)",
          opacity: 0.16,
        },
        "&:focus-visible": {
          outline: `2px solid ${COLORS.gold}`,
          outlineOffset: "3px",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(0deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 42%)",
          zIndex: 1,
        }}
      />

      {/* oversized ghosted initial */}
      <Typography
        className="cat-mark"
        aria-hidden="true"
        sx={{
          position: "absolute",
          top: isLarge ? "-10%" : "-14%",
          right: isLarge ? "0%" : "-4%",
          fontFamily: "'Fraunces', serif",
          fontWeight: 600,
          fontStyle: "italic",
          fontSize: isLarge ? 260 : 150,
          lineHeight: 1,
          color: "rgba(239,227,204,0.11)",
          userSelect: "none",
          pointerEvents: "none",
          transition: "transform 0.4s ease, opacity 0.4s ease",
          zIndex: 0,
        }}
      >
        {category.name.charAt(0)}
      </Typography>

      {/* arrow chip, top-right */}
      <Box
        className="cat-arrow"
        sx={{
          position: "absolute",
          top: isLarge ? 24 : 16,
          right: isLarge ? 24 : 16,
          width: isLarge ? 40 : 32,
          height: isLarge ? 40 : 32,
          borderRadius: "50%",
          bgcolor: "rgba(46,29,20,0.35)",
          border: "1px solid rgba(239,227,204,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.3s cubic-bezier(.2,.9,.3,1), background-color 0.3s ease",
          zIndex: 2,
        }}
      >
        <ArrowGlyph size={isLarge ? 18 : 15} />
      </Box>

      {/* label block */}
      <Box sx={{ position: "relative", zIndex: 2, p: isLarge ? "32px" : "20px", width: "100%" }}>
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            color: "rgba(239,227,204,0.7)",
            mb: "6px",
          }}
        >
          {category.count}
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 600,
            color: COLORS.sand,
            fontSize: isLarge ? 38 : 22,
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
          }}
        >
          {category.name}
        </Typography>
      </Box>
    </Box>
  );
}

export default function CategorySection() {
  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        maxWidth: 1350,
        mx: "auto",
        bgcolor: COLORS.sand,
        px: "5%",
        py: "72px",
      }}
    >
      {/* heading */}
      <Stack
        direction="row"
        alignItems="flex-end"
        justifyContent="space-between"
        sx={{ mb: "40px", borderBottom: `1px solid ${COLORS.sandDeep}`, pb: "28px" }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              color: COLORS.umber,
              fontSize: "clamp(32px, 3.6vw, 52px)",
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            Shop by{" "}
            <Box component="em" sx={{fontWeight: 500, color: COLORS.sienna }}>
              category
            </Box>
          </Typography>
        </Box>
      </Stack>

      {/* bento grid — fixed template so the large card locks to exactly 2x2 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "260px 260px",
          gridTemplateAreas: `
            "large large a b"
            "large large c d"
          `,
          gap: "16px",
        }}
      >
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.name} category={cat} />
        ))}
      </Box>
    </Box>
  );
}