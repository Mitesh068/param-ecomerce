import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Favorite, LocalShippingOutlined, ShoppingBagOutlined } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Container, IconButton, Stack, Typography } from "@mui/material";
import { getWishlist } from "../../Api/services/Services";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const getWishlistItems = (response) => {
  const payload = response?.data ?? response;
  return Array.isArray(payload?.items) ? payload.items : [];
};

function WishlistProduct({ product, onRemove }) {
  const image = product.image || product.image_url || product.images?.[0]?.url || product.images?.[0] || "";
  return <Box sx={{ overflow: "hidden", bgcolor: "#fff", border: "1px solid #ececec", borderRadius: 2.5, transition: "transform .22s ease, box-shadow .22s ease", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 28px rgba(0,0,0,.09)" } }}>
    <Box sx={{ position: "relative", aspectRatio: "1 / 1.05", overflow: "hidden", bgcolor: "#f3f3f3" }}>
      {image ? <Box component="img" src={image} alt={product.name} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <Box role="img" aria-label="No product image available" sx={{ width: "100%", height: "100%" }} />}
      {product.tags?.[0] && <Box sx={{ position: "absolute", top: 12, left: 12, px: 1, py: 0.45, borderRadius: 1, bgcolor: "#8b0000", color: "#fff", fontSize: 11, fontWeight: 800 }}>{product.tags[0]}</Box>}
      <IconButton aria-label={`Remove ${product.name} from wishlist`} onClick={() => onRemove(product.product_id)} sx={{ position: "absolute", top: 8, right: 8, bgcolor: "rgba(255,255,255,.94)", color: "#8b0000", "&:hover": { bgcolor: "#fff", color: "#650000" } }}><Favorite fontSize="small" /></IconButton>
    </Box>
    <Box sx={{ p: 2 }}>
      <Typography sx={{ color: "#777", fontSize: 12.5, mb: 0.5 }}>{product.category}</Typography>
      <Typography sx={{ minHeight: 45, fontWeight: 700, fontSize: 16, lineHeight: 1.4, color: "#242424" }}>{product.name}</Typography>
      <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 1.1 }}><Typography sx={{ fontSize: 18, fontWeight: 800 }}>{money(product.price)}</Typography>{Number(product.compare_at_price) > Number(product.price) && <Typography sx={{ color: "#999", fontSize: 13, textDecoration: "line-through" }}>{money(product.compare_at_price)}</Typography>}</Stack>
      <Button fullWidth component={RouterLink} to={`/products/${product.product_id}`} startIcon={<ShoppingBagOutlined />} variant="outlined" sx={{ mt: 1.8, borderColor: "#8b0000", color: "#8b0000", fontWeight: 750, textTransform: "none", "&:hover": { borderColor: "#650000", color: "#650000", bgcolor: "#fff7f7" } }}>View product</Button>
    </Box>
  </Box>;
}

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadWishlist = useCallback(async (isCancelled = () => false) => {
    setLoading(true);
    setError("");
    try {
      const response = await getWishlist();
      if (!isCancelled()) setProducts(getWishlistItems(response));
    } catch (err) {
      if (!isCancelled()) {
        setProducts([]);
        setError(err?.response?.data?.message || err?.message || "Unable to load your wishlist.");
      }
    } finally {
      if (!isCancelled()) setLoading(false);
    }
  }, []);
  useEffect(() => {
    let cancelled = false;
    loadWishlist(() => cancelled);
    return () => { cancelled = true; };
  }, [loadWishlist]);
  const removeProduct = (id) => setProducts((items) => items.filter((product) => product.product_id !== id));

  return <Box sx={{ minHeight: "100vh", bgcolor: "#F7F7F7", py: { xs: 3.5, md: 5.5 } }}>
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "flex-end" }} spacing={1.5} sx={{ mb: 3.5 }}>
        <Box><Typography component="h1" sx={{ color: "#202020", fontSize: { xs: 28, sm: 34 }, fontWeight: 800 }}>My wishlist</Typography><Typography sx={{ mt: 0.55, color: "#777", fontSize: 15 }}>{products.length ? `${products.length} saved ${products.length === 1 ? "item" : "items"} waiting for you.` : "Your saved items will appear here."}</Typography></Box>
      </Stack>

      {loading ? <Stack alignItems="center" sx={{ py: 8 }}><CircularProgress sx={{ color: "#8b0000" }} /></Stack> : error ? <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => loadWishlist()}>Retry</Button>}>{error}</Alert> : products.length ? <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: { xs: 2, sm: 2.5 } }}>{products.map((product) => <WishlistProduct key={product.wishlist_item_id ?? product.product_id} product={product} onRemove={removeProduct} />)}</Box> : <Box sx={{ maxWidth: 520, mx: "auto", py: { xs: 7, sm: 9 }, px: 3, textAlign: "center", bgcolor: "#fff", border: "1px solid #ececec", borderRadius: 3 }}><Box sx={{ width: 72, height: 72, display: "grid", placeItems: "center", mx: "auto", mb: 2, borderRadius: "50%", bgcolor: "#f9e9e9", color: "#8b0000" }}><Favorite sx={{ fontSize: 34 }} /></Box><Typography sx={{ fontSize: 22, fontWeight: 800 }}>Your wishlist is empty</Typography><Typography sx={{ mt: 1, color: "#777", lineHeight: 1.6 }}>Save products you love and come back to them whenever you are ready.</Typography><Button component={RouterLink} to="/category" variant="contained" disableElevation sx={{ mt: 3, px: 3.2, py: 1.2, bgcolor: "#8b0000", textTransform: "none", fontWeight: 750, "&:hover": { bgcolor: "#650000" } }}>Explore products</Button></Box>}

      {!loading && !error && products.length > 0 && <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ mt: 4, color: "#5b806e" }}><LocalShippingOutlined fontSize="small" /><Typography sx={{ fontSize: 14 }}>Free shipping and easy returns on your saved favourites.</Typography></Stack>}
    </Container>
  </Box>;
}
