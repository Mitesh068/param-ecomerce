import React from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  Typography,
  Button,
  Stack,
  IconButton,
  Rating,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

// ---------- COLOR TOKENS ----------
const COLORS = {
  charcoal: "#151515",
  charcoal2: "#000000",
  charcoal3: "#151515",
  parchment: "#FFFFFF",
  ink: "#1A1A1A",
  brass: "#8B0000",
  brassBright: "#E4E4E4",
  verdigris: "#8B0000",
  rust: "#8B0000",
  hairline: "rgba(0,0,0,0.1)",
  cardBorder: "rgba(0,0,0,0.08)",
  star: "#F5A623",
};

// ---------- DATA ----------
const products = [
  {
    sku: "041",
    cat: "Accessories",
    title: "Urban Rider Backpack",
    price: 2499,
    rating: 4.5,
    reviews: 48,
    isNew: true,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
  },
  {
    sku: "019",
    cat: "Accessories",
    title: "Weekender Duffel Bag",
    price: 3199,
    rating: 4.8,
    reviews: 112,
    isNew: false,
    image:
      "https://images.unsplash.com/photo-1547949003-9792a18a2645?w=600&q=80",
  },
  {
    sku: "052",
    cat: "Footwear",
    title: "Trail Runner Sneakers",
    price: 4599,
    rating: 4.2,
    reviews: 76,
    isNew: true,
  },
];

// ---------- PRODUCT CARD ----------
function ProductCard({ title, cat, price, rating, reviews, isNew, image }) {
  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        width: "300px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: COLORS.parchment,
        borderRadius: "12px",
        border: `1px solid ${COLORS.cardBorder}`,
        overflow: "hidden",
        transition: "transform .25s ease, box-shadow .25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 32px -18px rgba(0,0,0,0.35)",
        },
      }}
    >
      {/* image */}
      <Box
        sx={{
          position: "relative",
          height: 260,
          bgcolor: "#EDEDED",
        }}
      >
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        {isNew && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              bgcolor: "#fff",
              color: COLORS.ink,
              fontSize: 12,
              fontWeight: 700,
              px: 1.5,
              py: 0.5,
              borderRadius: "999px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            New
          </Box>
        )}

        <IconButton
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: "#fff",
            width: 32,
            height: 32,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            "&:hover": { bgcolor: "#fff" },
          }}
        >
          <FavoriteBorderIcon sx={{ fontSize: 17, color: COLORS.ink }} />
        </IconButton>
      </Box>

      {/* content */}
      <Stack sx={{ p: 2.25, flexGrow: 1 }} spacing={0.75}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: COLORS.rust,
          }}
        >
          {cat}
        </Typography>

        <Typography sx={{ fontWeight: 700, fontSize: 17, color: COLORS.ink, lineHeight: 1.3 }}>
          {title}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ pt: 0.5 }}>
          <Rating value={rating} precision={0.5} readOnly size="small" sx={{ color: COLORS.star }} />
          <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.55)" }}>{reviews}</Typography>
        </Stack>

        <Typography sx={{ fontWeight: 700, fontSize: 20, color: COLORS.ink, pt: 0.5 }}>
          ₹{price.toLocaleString("en-IN")}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          fullWidth
          startIcon={<ShoppingBagIcon sx={{ fontSize: 18 }} />}
          sx={{
            mt: 1,
            fontSize: 14,
            fontWeight: 600,
            textTransform: "none",
            color: "#fff",
            bgcolor: COLORS.brass,
            py: 1.1,
            borderRadius: "8px",
            "&:hover": { bgcolor: "#6e0000" },
          }}
        >
          Add to bag
        </Button>
      </Stack>
    </Card>
  );
}

// ---------- SECTION ----------
export default function ProductCatalog() {
  return (
    <Box component="section" sx={{ color: COLORS.charcoal, py: { xs: 6, md: 10 }, bgcolor: "#FAFAFA" }}>
      <Container maxWidth="lg">
        {/* HEADER */}
        <Box sx={{ pb: 5, borderBottom: `1px solid ${COLORS.hairline}` }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: 34, sm: 44, md: 56 },
              lineHeight: 1.05,
              color: COLORS.charcoal,
            }}
          >
            Gear worth{" "}
            <Box component="em" sx={{ fontStyle: "italic" }}>
              the journey.
            </Box>
          </Typography>
          <Typography sx={{ mt: 3, maxWidth: 460, color: "rgba(20,19,14,0.65)" }}>
            Hand-picked essentials for people who move. Four pieces from
            this season's run — small batch, honestly priced.
          </Typography>
        </Box>

        {/* GRID */}
        <Grid container spacing={3} sx={{ mt: 1 }} alignItems="stretch">
          {products.map((p) => (
            <Grid item xs={12} sm={6} md={3} key={p.sku} sx={{ display: "flex" }}>
              <ProductCard {...p} />
            </Grid>
          ))}
        </Grid>

        {/* EXPLORE MORE */}
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            p: { xs: 4, md: 6 },
            borderRadius: 2,
            border: `1px solid ${COLORS.hairline}`,
            background: `linear-gradient(135deg, ${COLORS.charcoal2}, ${COLORS.charcoal3})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontStyle: "italic",
                fontSize: { xs: 24, md: 32 },
                mb: 1,
                color: COLORS.parchment,
              }}
            >
              There's a full catalog behind this.
            </Typography>
            <Typography sx={{ color: "rgba(237,230,211,0.6)", maxWidth: 420 }}>
              These four are this season's picks. The rest is one click away.
            </Typography>
          </Box>
          <Button
            variant="contained"
            disableElevation
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: COLORS.brass,
              color: COLORS.parchment,
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              px: 3.5,
              py: 1.8,
              borderRadius: "6px",
              boxShadow: "none",
              "&:hover": { bgcolor: COLORS.brassBright, color: COLORS.charcoal, boxShadow: "none" },
            }}
          >
            Explore more products
          </Button>
        </Box>
      </Container>
    </Box>
  );
}