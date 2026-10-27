import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Link,
  IconButton,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PinterestIcon from "@mui/icons-material/Pinterest";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Matches the palette used in ProductCatalog / Home sections
const COLORS = {
  charcoal: "#151515",
  charcoal2: "#000000",
  parchment: "#FFFFFF",
  brass: "#BC0507",
  brassBright: "#C0C0C0",
  verdigris: "#BC0507",
  hairline: "rgba(192,192,192,0.24)",
  muted: "rgba(255,255,255,0.68)",
  mutedDim: "rgba(255,255,255,0.44)",
};

const linkColumns = [
  {
    heading: "Shop",
    links: ["All Products", "Cutting", "Marking", "Storage", "Maintenance"],
  },
  {
    heading: "Company",
    links: ["About", "Workshop Journal", "Careers", "Wholesale"],
  },
  {
    heading: "Support",
    links: ["Shipping & Returns", "Care Guide", "Warranty", "Contact"],
  },
];

function FooterLink({ children }) {
  return (
    <Link
      href="#"
      underline="none"
      sx={{
        color: COLORS.muted,
        fontSize: 14,
        transition: "color .2s ease",
        "&:hover": { color: COLORS.brassBright },
      }}
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: COLORS.charcoal,
        color: COLORS.parchment,
        pt: { xs: 6, md: 9 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* BRAND + NEWSLETTER */}
          <Grid item xs={12} md={4}>
            <Typography
              sx={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                fontSize: 26,
                mb: 1.5,
              }}
            >
              Param
            </Typography>
            <Typography sx={{ color: COLORS.muted, fontSize: 14, maxWidth: 320, mb: 3 }}>
                Thoughtful clothing and quiet objects for the daily ritual. Small batch,
              honestly made, designed to stay in your life.
            </Typography>

            <Typography
              sx={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: COLORS.brass,
                mb: 1.5,
              }}
            >
              Join the Param note
            </Typography>
            <Stack direction="row" spacing={0} sx={{ maxWidth: 320 }}>
              <TextField
                placeholder="you@email.com"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: COLORS.charcoal2,
                    borderRadius: "2px 0 0 2px",
                    color: COLORS.parchment,
                    fontSize: 14,
                    "& fieldset": { borderColor: COLORS.hairline },
                    "&:hover fieldset": { borderColor: COLORS.brass },
                    "&.Mui-focused fieldset": { borderColor: COLORS.brass },
                  },
                }}
              />
              <Button
                variant="contained"
                disableElevation
                sx={{
                  bgcolor: COLORS.brass,
                  color: COLORS.charcoal,
                  borderRadius: "0 2px 2px 0",
                  minWidth: 44,
                  px: 1.5,
                  boxShadow: "none",
                  "&:hover": { bgcolor: COLORS.brassBright, boxShadow: "none" },
                }}
              >
                <ArrowForwardIcon fontSize="small" />
              </Button>
            </Stack>
          </Grid>

          {/* LINK COLUMNS */}
          {linkColumns.map((col) => (
            <Grid item xs={6} sm={4} md={2.3} key={col.heading}>
              <Typography
                sx={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: COLORS.verdigris,
                  mb: 2,
                }}
              >
                {col.heading}
              </Typography>
              <Stack spacing={1.3}>
                {col.links.map((label) => (
                  <FooterLink key={label}>{label}</FooterLink>
                ))}
              </Stack>
            </Grid>
          ))}

          {/* SOCIAL */}
          <Grid item xs={12} sm={4} md={1.1}>
            <Typography
              sx={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: COLORS.verdigris,
                mb: 2,
              }}
            >
              Follow
            </Typography>
            <Stack direction="row" spacing={1}>
              {[InstagramIcon, PinterestIcon, YouTubeIcon].map((Icon, i) => (
                <IconButton
                  key={i}
                  size="small"
                  sx={{
                    color: COLORS.parchment,
                    border: `1px solid ${COLORS.hairline}`,
                    borderRadius: "2px",
                    "&:hover": {
                      color: COLORS.charcoal,
                      bgcolor: COLORS.brassBright,
                      borderColor: COLORS.brassBright,
                    },
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: COLORS.hairline, mt: 6, mb: 3 }} />

        {/* BOTTOM BAR */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
          sx={{ pb: 4 }}
        >
          <Typography
            sx={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              color: COLORS.mutedDim,
              letterSpacing: "0.04em",
            }}
          >
            © {new Date().getFullYear()} Param. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Typography
              component="a"
              href="#"
              sx={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: COLORS.mutedDim,
                textDecoration: "none",
                "&:hover": { color: COLORS.brassBright },
              }}
            >
              Privacy
            </Typography>
            <Typography
              component="a"
              href="#"
              sx={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: COLORS.mutedDim,
                textDecoration: "none",
                "&:hover": { color: COLORS.brassBright },
              }}
            >
              Terms
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}