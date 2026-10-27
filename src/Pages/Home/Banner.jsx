import * as React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";

// Palette tokens
const COLORS = {
  umber: "#151515",
  sienna: "#BC0507",
  siennaDark: "#8F0002",
  sand: "#F7F7F7",
  olive: "#C0C0C0",
  gold: "#BC0507",
};

export default function SaleBanner() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 1600,
        mx: "auto",
        aspectRatio: "1400 / 440",
        minHeight: 300,
        bgcolor: COLORS.umber,
        borderRadius: "6px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 20px 50px -20px rgba(46,29,20,0.5)",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 88% 20%, rgba(212,169,74,0.18) 0%, transparent 45%),
            radial-gradient(circle at 78% 85%, rgba(193,80,46,0.25) 0%, transparent 50%),
            radial-gradient(circle at 105% 50%, rgba(107,113,80,0.22) 0%, transparent 55%)
          `,
          pointerEvents: "none",
        },
      }}
    >
      {/* ambient arcs */}
      <Box
        component="svg"
        viewBox="0 0 500 700"
        aria-hidden="true"
        sx={{
          position: "absolute",
          right: "-4%",
          top: "50%",
          transform: "translateY(-50%)",
          height: "145%",
          zIndex: 1,
          opacity: 0.9,
        }}
      >
        <path d="M500 0 C 300 120, 300 580, 500 700" stroke={COLORS.gold} strokeOpacity="0.18" strokeWidth="1.5" fill="none" />
        <path d="M470 -20 C 250 130, 250 570, 470 720" stroke={COLORS.sand} strokeOpacity="0.12" strokeWidth="1" fill="none" />
        <path d="M440 -40 C 200 140, 200 560, 440 740" stroke={COLORS.sienna} strokeOpacity="0.2" strokeWidth="1.5" fill="none" />
        <path d="M410 -60 C 150 150, 150 550, 410 760" stroke={COLORS.olive} strokeOpacity="0.18" strokeWidth="1" fill="none" />
      </Box>

      {/* main content */}
      <Box sx={{ position: "relative", zIndex: 2, px: "5%", py: "6%", maxWidth: "58%", display: "flex", flexDirection: "column", gap: "18px" }}>
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Box sx={{ width: 22, height: 1, bgcolor: COLORS.gold }} />
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: COLORS.gold,
            }}
          >
            Season Close-Out
          </Typography>
        </Stack>

        <Typography
          sx={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 600,
            color: COLORS.sand,
            fontSize: "clamp(34px, 5.2vw, 72px)",
            lineHeight: 0.98,
            letterSpacing: "-0.01em",
          }}
        >
          Layer up for
          <br />
          <Box component="em" sx={{ fontStyle: "italic", fontWeight: 500, color: COLORS.sienna }}>
            less
          </Box>
          , all week.
        </Typography>

        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            color: "rgba(239,227,204,0.72)",
            fontSize: 16,
            maxWidth: 420,
            lineHeight: 1.5,
          }}
        >
          Coats, knits, and boots marked down before the first frost. While sizes last — new stock doesn't get discounted twice.
        </Typography>

        <Stack direction="row" alignItems="center" spacing={3.5} sx={{ mt: 1, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            disableElevation
            sx={{
              bgcolor: COLORS.sienna,
              color: COLORS.sand,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 15,
              textTransform: "none",
              borderRadius: "3px",
              px: 4,
              py: 1.75,
              "&:hover": {
                bgcolor: COLORS.siennaDark,
                transform: "translateY(-2px)",
              },
              transition: "transform 0.18s ease, background 0.18s ease",
            }}
          >
            Shop the sale
          </Button>

          <Box>
            <Typography
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(239,227,204,0.5)",
              }}
            >
              Use code
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Fraunces', serif",
                fontStyle: "italic",
                fontSize: 19,
                color: COLORS.sand,
                borderBottom: "1px dashed rgba(239,227,204,0.4)",
                pb: "2px",
                display: "inline-block",
              }}
            >
              HARVEST30
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* discount stub, signature element */}
      <Box
        sx={{
          position: "absolute",
          right: { md: "64px", lg: "64px" },
          top: "50%",
          transform: "translateY(-50%) rotate(-4deg)",
          zIndex: 3,
          width: 190,
          aspectRatio: "1 / 1.15",
          bgcolor: COLORS.gold,
          color: COLORS.umber,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.35))",
          WebkitMaskImage: `
            radial-gradient(circle 7px at 0 50%, transparent 7px, black 7.5px),
            radial-gradient(circle 7px at 100% 50%, transparent 7px, black 7.5px)
          `,
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
        }}
      >
        <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 46, lineHeight: 1 }}>
          30%
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 700,
            mt: "2px",
          }}
        >
          Off
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            mt: 1,
            fontSize: 10,
            letterSpacing: "0.06em",
            color: "rgba(46,29,20,0.65)",
            maxWidth: "80%",
          }}
        >
          Ends Sunday
        </Typography>
      </Box>
    </Box>
  );
}