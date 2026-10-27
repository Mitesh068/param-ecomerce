import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Alert, Box, Breadcrumbs, Button, Chip, CircularProgress, Container, Divider, IconButton, Modal, Rating, Stack, Typography } from "@mui/material";
import { BadgeIndianRupee, CircleDollarSign, Heart, ShoppingBag, Star, Truck } from "lucide-react";
import { addToCart, getWishlist, productById, wishlist } from "../../Api/services/Services";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
const extractProduct = (response) => {
  const payload = response?.data ?? response;
  return payload?.product ?? payload?.data?.product ?? payload?.data ?? (payload?.id ? payload : null);
};
const getImages = (product) => (product?.images ?? []).map((image) => typeof image === "string" ? image : image?.url).filter(Boolean);

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadProduct = useCallback(async (isCancelled = () => false) => {
    if (!id) { setError("Invalid product id."); setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const response = await productById(id);
      if (!isCancelled()) setProduct(extractProduct(response));
    } catch (err) {
      if (!isCancelled()) { setProduct(null); setError(err?.response?.data?.message || err?.message || "Unable to load this product."); }
    } finally { if (!isCancelled()) setLoading(false); }
  }, [id]);
  useEffect(() => { let cancelled = false; loadProduct(() => cancelled); return () => { cancelled = true; }; }, [loadProduct]);
  const images = getImages(product);
  const price = Number(product?.price ?? 0);
  const compareAtPrice = Number(product?.compare_at_price ?? 0);
  const discount = compareAtPrice > price && price > 0 ? Math.round((compareAtPrice - price) / compareAtPrice * 100) : 0;
  const [quantity, setQuantity] = useState("1");
  const [quantityOpen, setQuantityOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [wishlistPending, setWishlistPending] = useState(false);
  const [cartPending, setCartPending] = useState(false);
  const [actionError, setActionError] = useState("");
  useEffect(() => {
    let cancelled = false;
    getWishlist().then((response) => {
      const payload = response?.data ?? response;
      const items = payload?.items ?? payload?.data?.items ?? [];
      if (!cancelled && Array.isArray(items)) setSaved(items.some((item) => String(item.product_id) === String(id)));
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [id]);
  const saveToWishlist = async () => {
    if (saved || wishlistPending) return;
    setActionError("");
    setWishlistPending(true);
    try { await wishlist(id); setSaved(true); }
    catch (err) { setActionError(err?.response?.data?.message || err?.message || "Unable to add this product to your wishlist."); }
    finally { setWishlistPending(false); }
  };
  const addProductToCart = async () => {
    if (cartPending || product?.stock_quantity === 0) return;
    setActionError("");
    setCartPending(true);
    try { await addToCart(id, Number(quantity)); setAdded(true); }
    catch (err) { setActionError(err?.response?.data?.message || err?.message || "Unable to add this product to your cart."); }
    finally { setCartPending(false); }
  };
  return <Box sx={{ minHeight: "100vh", bgcolor: "#F7F7F7", pb: 9 }}><Container maxWidth="xl" sx={{ pt: { xs: 3, md: 5 } }}>
    {loading && <Stack alignItems="center" sx={{ py: 10 }}><CircularProgress sx={{ color: "#8b0000" }} /></Stack>}
    {!loading && error && <Alert severity="error" sx={{ mb: 3 }} action={<Button color="inherit" size="small" onClick={() => loadProduct()}>Retry</Button>}>{error}</Alert>}
    {!loading && !error && !product && <Typography color="text.secondary">Product not found.</Typography>}
    {!loading && product && <>
    {actionError && <Alert severity="error" onClose={() => setActionError("")} sx={{ mb: 2 }}>{actionError}</Alert>}
    <Breadcrumbs separator="/" sx={{ mb: 3, "& a": { color: "#777", textDecoration: "none" } }}><RouterLink to="/">Home</RouterLink><RouterLink to="/products">Products</RouterLink><Typography>{product.name}</Typography></Breadcrumbs>
    <Box sx={{ display: "grid", gridTemplateColumns: { md: "minmax(0,1.08fr) minmax(360px,.92fr)" }, gap: { xs: 4, md: 7 } }}>
      <Box><Box sx={{ height: { xs: 350, sm: 500, md: 610 }, overflow: "hidden", position: "relative", borderRadius: 3, bgcolor: "#f0eeeb" }}>{images[0] ? <Box component="img" src={images[0]} alt={product.name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Box sx={{ width: "100%", height: "100%" }} />}{product.tags?.[0] && <Chip label={product.tags[0]} sx={{ position: "absolute", top: 18, left: 18, fontWeight: 800, bgcolor: "white" }} />}</Box>{images.slice(1).map((image) => <Box key={image} component="img" src={image} alt={product.name} sx={{ height: 76, width: 76, mt: 1.5, mr: 1, objectFit: "cover", borderRadius: 1.5 }} />)}</Box>
      <Box><Typography sx={{ color: "#8b0000", fontSize: ".78rem", fontWeight: 850, textTransform: "uppercase", letterSpacing: ".1em" }}>{typeof product.category === "string" ? product.category : product.category?.name}</Typography><Stack direction="row" justifyContent="space-between" gap={2}><Typography component="h1" sx={{ fontSize: { xs: "2rem", md: "2.7rem" }, lineHeight: 1.08, letterSpacing: "-.04em", fontWeight: 850, mt: .7 }}>{product.name}</Typography><IconButton onClick={saveToWishlist} disabled={saved || wishlistPending} aria-label={saved ? "Saved to wishlist" : "Add to wishlist"} sx={{ alignSelf: "flex-start", border: "1px solid #ddd" }}><Heart size={20} fill={saved ? "#8b0000" : "none"} color={saved ? "#8b0000" : "#222"} /></IconButton></Stack>{product.sku && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>SKU: {product.sku}</Typography>}<Stack direction="row" spacing={1.2} alignItems="baseline" sx={{ mt: 2.3 }}><Typography sx={{ fontSize: "1.9rem", fontWeight: 850 }}>{money(price)}</Typography>{compareAtPrice > price && <Typography sx={{ color: "#999", textDecoration: "line-through" }}>{money(compareAtPrice)}</Typography>}{discount > 0 && <Chip label={`${discount}% off`} size="small" sx={{ bgcolor: "#eaf6ed", color: "#28713c", fontWeight: 800 }} />}</Stack><Typography color="text.secondary" sx={{ lineHeight: 1.7, mt: 2 }}>{product.short_description}</Typography><Divider sx={{ my: 3 }} />
        <Typography fontWeight={800}>Select size</Typography><Stack direction="row" spacing={1} sx={{ mt: 1.2 }}>{["S", "M", "L", "XL"].map((size) => <Button key={size} variant={size === "M" ? "contained" : "outlined"} sx={{ minWidth: 52, color: size === "M" ? "white" : "#333", borderColor: "#ddd", bgcolor: size === "M" ? "#171313" : "white", "&:hover": { bgcolor: size === "M" ? "#333" : "#f5f5f5" } }}>{size}</Button>)}</Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}><Button onClick={() => setQuantityOpen(true)} variant="outlined" sx={{ width: { xs: "100%", sm: 150 }, height: 50, justifyContent: "space-between", color: "#222", borderColor: "#d6d6d6", textTransform: "none", fontWeight: 700, "&:hover": { borderColor: "#8b0000", bgcolor: "#fff8f8" } }}>Qty: {quantity}<Box component="span" sx={{ color: "#8b0000" }}>Change</Box></Button><Button onClick={addProductToCart} disabled={cartPending || product.stock_quantity === 0} startIcon={<ShoppingBag size={18} />} variant="contained" sx={{ flex: 1, py: 1.35, textTransform: "none", fontWeight: 800, bgcolor: added ? "#327343" : "#8b0000", "&:hover": { bgcolor: added ? "#276136" : "#700000" } }}>{cartPending ? "Adding..." : added ? `Added ${quantity} to bag` : product.stock_quantity === 0 ? "Out of stock" : "Add to bag"}</Button></Stack>
        <Box sx={{ mt: 3, p: 2.25, border: "1px solid #f0d7c7", borderRadius: 2, bgcolor: "#fffaf7" }}><Typography fontWeight={850} sx={{ color: "#8b0000", mb: 1.2 }}>Available offers</Typography><Stack spacing={1}><Stack direction="row" spacing={1.2}><BadgeIndianRupee size={18} color="#8b0000" /><Typography variant="body2"><b>Bank offer:</b> Get 10% instant discount up to ₹500 on select cards.</Typography></Stack><Stack direction="row" spacing={1.2}><CircleDollarSign size={18} color="#8b0000" /><Typography variant="body2"><b>Special price:</b> Extra ₹200 off when you buy any two riding essentials.</Typography></Stack><Stack direction="row" spacing={1.2}><Truck size={18} color="#8b0000" /><Typography variant="body2"><b>Free delivery:</b> Free standard shipping on this order.</Typography></Stack></Stack></Box>
      </Box>
    </Box>
    <Modal open={quantityOpen} onClose={() => setQuantityOpen(false)} aria-labelledby="quantity-title"><Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(390px, calc(100% - 32px))", bgcolor: "white", borderRadius: 3, boxShadow: 24, p: 3 }}><Typography id="quantity-title" variant="h6" fontWeight={850}>Choose quantity</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .6 }}>Select how many items you would like to add.</Typography><Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, mt: 2.5 }}>{[1, 2, 3, 4, 5].map((item) => <Button key={item} onClick={() => { setQuantity(String(item)); setQuantityOpen(false); }} variant={quantity === String(item) ? "contained" : "outlined"} sx={{ minWidth: 0, height: 48, color: quantity === String(item) ? "white" : "#333", borderColor: "#ddd", bgcolor: quantity === String(item) ? "#8b0000" : "white", "&:hover": { bgcolor: quantity === String(item) ? "#700000" : "#f7f7f7" } }}>{item}</Button>)}</Box><Button fullWidth onClick={() => setQuantityOpen(false)} sx={{ mt: 2.5, color: "#8b0000", textTransform: "none" }}>Done</Button></Box></Modal>
    {/* <Box sx={{ display: "flex", gap: { xs: 2.5, sm: 4 }, overflowX: "auto", py: 3.5, mt: { xs: 5, md: 7 }, borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}><Benefit icon={<Undo2 size={25} />}>10 days Service Centre<br />Replacement</Benefit><Benefit icon={<Truck size={25} />}>Free Delivery</Benefit><Benefit icon={<ShieldCheck size={25} />}>1 Year<br />Warranty</Benefit><Benefit icon={<BadgeIndianRupee size={25} />}>Pay on Delivery</Benefit><Benefit icon={<Star size={25} />}>Top Brand</Benefit><Benefit icon={<Truck size={25} />}>Anywhere<br />Delivery</Benefit></Box> */}
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 1.5, mt: 2.5 }}><Box sx={{ p: 1.5, bgcolor: "#f8f8f8", borderRadius: 1.5 }}><Typography fontWeight={800} variant="body2">Easy returns</Typography><Typography variant="caption" color="text.secondary">Return unused items within 7 days of delivery.</Typography></Box><Box sx={{ p: 1.5, bgcolor: "#f8f8f8", borderRadius: 1.5 }}><Typography fontWeight={800} variant="body2">Replacement policy</Typography><Typography variant="caption" color="text.secondary">Get a replacement for manufacturing defects.</Typography></Box><Box sx={{ p: 1.5, bgcolor: "#f8f8f8", borderRadius: 1.5 }}><Typography fontWeight={800} variant="body2">Need help?</Typography><Typography variant="caption" color="text.secondary">Our support team is available 7 days a week.</Typography></Box></Box>
    <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1.45fr" }, gap: { xs: 5, md: 8 }, mt: { xs: 6, md: 8 } }}><Box><Typography variant="h5" fontWeight={850}>Product details</Typography><Typography sx={{ mt: 1.5, color: "text.secondary", lineHeight: 1.7, whiteSpace: "pre-line" }}>{product.detailed_description || product.short_description || "No additional details available."}</Typography>{product.tags?.length > 0 && <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>{product.tags.map((tag) => <Chip key={tag} label={tag} size="small" />)}</Stack>}<Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">{product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}</Typography></Box></Box>
    </>}
  </Container></Box>;
}
