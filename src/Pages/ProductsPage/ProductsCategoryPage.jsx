import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Alert,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Rating,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Filter, Grid2X2, Heart, LayoutList, Search, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import { addToCart as addToCartRequest, categoryList, getWishlist, productList, wishlist } from "../../Api/services/Services";

const inr = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
const getProductImage = (product) => product.image || product.image_url || product.product_image || product.thumbnail || product.images?.[0]?.url || product.images?.[0] || "";
const getProductCategory = (product) => typeof product.category === "string" ? product.category : product.category?.name || product.category_name || "";
const getProductPrice = (product) => Number(product.price ?? product.sale_price ?? product.selling_price ?? 0);

function Filters({ categories, category, setCategory, price, setPrice, close }) {
  return <Box sx={{ p: { xs: 2.5, md: 0 } }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
      <Typography variant="h6" fontWeight={800}>Filters</Typography>
      {close && <IconButton onClick={close} aria-label="Close filters"><X size={20} /></IconButton>}
    </Stack>
    <Divider />
    <Typography fontWeight={750} sx={{ mt: 2.5, mb: 1.4 }}>Category</Typography>
    <Stack spacing={0.5}>{categories.map((item) => <Button key={item} onClick={() => setCategory(item)} sx={{ justifyContent: "flex-start", color: category === item ? "#8b0000" : "#404040", fontWeight: category === item ? 800 : 500, textTransform: "none", px: 1.25, py: 0.65, borderRadius: 1.5, bgcolor: category === item ? "#fff2f2" : "transparent", "&:hover": { bgcolor: "#fff2f2" } }}>{item}</Button>)}</Stack>
    <Divider sx={{ my: 2.5 }} />
    <Typography fontWeight={750}>Price range</Typography>
    <Slider value={price} onChange={(_, value) => setPrice(value)} min={0} max={8000} step={500} sx={{ color: "#8b0000", mt: 2, "& .MuiSlider-thumb": { width: 15, height: 15 } }} />
    <Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary">{inr(price[0])}</Typography><Typography variant="body2" color="text.secondary">{inr(price[1])}</Typography></Stack>
    <Divider sx={{ my: 2.5 }} />
    <Typography fontWeight={750} sx={{ mb: 1.4 }}>Availability</Typography>
    <Stack spacing={0.25}><Button sx={{ justifyContent: "flex-start", textTransform: "none", color: "#404040" }}>In stock <Box component="span" sx={{ ml: "auto", color: "#999" }}>24</Box></Button><Button sx={{ justifyContent: "flex-start", textTransform: "none", color: "#404040" }}>On sale <Box component="span" sx={{ ml: "auto", color: "#999" }}>12</Box></Button></Stack>
  </Box>;
}

export default function ProductsPage() {
  const [category, setCategory] = useState("All products");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [price, setPrice] = useState([0, 8000]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const [wishlistPending, setWishlistPending] = useState([]);
  const [wishlistError, setWishlistError] = useState("");
  const [bagItems, setBagItems] = useState([]);
  const [cartPending, setCartPending] = useState([]);
  const [cartError, setCartError] = useState("");
  const [view, setView] = useState("grid");
  const pageSize = 8;

  useEffect(() => {
    let isCurrent = true;

    categoryList()
      .then((response) => {
        if (!isCurrent) return;
        const names = Array.isArray(response?.categories)
          ? response.categories.map((item) => item?.name).filter((name) => typeof name === "string" && name.trim())
          : [];
        setCategories(names);
      })
      .catch((error) => {
        console.error("Failed to load categories", error);
      });

    return () => { isCurrent = false; };
  }, []);

  useEffect(() => {
    let isCurrent = true;
    getWishlist()
      .then((response) => {
        if (!isCurrent) return;
        const payload = response?.data ?? response;
        const items = Array.isArray(payload?.items) ? payload.items : [];
        setFavourites(items.map((item) => String(item.product_id)));
      })
      .catch((error) => {
        if (isCurrent) setWishlistError(error?.response?.data?.message || error?.message || "Unable to load your wishlist.");
      });
    return () => { isCurrent = false; };
  }, []);

  useEffect(() => {
    let isCurrent = true;

    productList()
      .then((response) => {
        if (!isCurrent) return;
        setProducts(Array.isArray(response?.products) ? response.products : []);
      })
      .catch((error) => {
        console.error("Failed to load products", error);
        if (isCurrent) setProducts([]);
      })
      .finally(() => {
        if (isCurrent) setProductsLoading(false);
      });

    return () => { isCurrent = false; };
  }, []);

  const categoryOptions = ["All products", ...categories];

  const visibleProducts = useMemo(() => {
    const matching = products.filter((product) => {
      const name = String(product.name || product.title || product.product_name || "");
      const productCategory = getProductCategory(product);
      const productPrice = getProductPrice(product);
      return (category === "All products" || productCategory === category) && productPrice >= price[0] && productPrice <= price[1] && name.toLowerCase().includes(query.toLowerCase());
    });
    return [...matching].sort((a, b) => sort === "low" ? getProductPrice(a) - getProductPrice(b) : sort === "high" ? getProductPrice(b) - getProductPrice(a) : sort === "rating" ? Number(b.rating || 0) - Number(a.rating || 0) : Number(a.id || 0) - Number(b.id || 0));
  }, [products, category, price, query, sort]);

  const pageCount = Math.ceil(visibleProducts.length / pageSize);
  const paginatedProducts = visibleProducts.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [category, price, query, sort]);

  const toggleFavourite = async (id) => {
    const productId = String(id);
    if (favourites.includes(productId) || wishlistPending.includes(productId)) return;
    setWishlistError("");
    setWishlistPending((current) => [...current, productId]);
    try {
      await wishlist(id);
      setFavourites((current) => current.includes(productId) ? current : [...current, productId]);
    } catch (error) {
      setWishlistError(error?.response?.data?.message || error?.message || "Unable to add this product to your wishlist.");
    } finally {
      setWishlistPending((current) => current.filter((item) => item !== productId));
    }
  };
  const addToBag = async (id) => {
    const productId = String(id);
    if (bagItems.includes(productId) || cartPending.includes(productId)) return;
    setCartError("");
    setCartPending((current) => [...current, productId]);
    try {
      await addToCartRequest(id, 1);
      setBagItems((current) => current.includes(productId) ? current : [...current, productId]);
    } catch (error) {
      setCartError(error?.response?.data?.message || error?.message || "Unable to add this product to your cart.");
    } finally {
      setCartPending((current) => current.filter((item) => item !== productId));
    }
  };

  return <Box sx={{ bgcolor: "#F7F7F7", minHeight: "100vh", pb: 8 }}>
    <Box sx={{ bgcolor: "#151515", color: "white", py: { xs: 4.5, md: 6.5 }, mb: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl"><Breadcrumbs separator="/" sx={{ "& .MuiBreadcrumbs-separator": { color: "#807777" }, "& a": { color: "#b9b1b1", textDecoration: "none" } }}><RouterLink to="/">Home</RouterLink><Typography color="#fff">Products</Typography></Breadcrumbs><Typography component="h1" sx={{ fontSize: { xs: "2.25rem", md: "3.2rem" }, fontWeight: 850, letterSpacing: "-0.04em", mt: 1 }}>Ride in your style.</Typography><Typography sx={{ color: "#c7bcbc", maxWidth: 520, mt: 1 }}>Quality gear and everyday essentials chosen for every road ahead.</Typography></Container>
    </Box>
    <Container maxWidth="xl">
      <Box sx={{ display: "grid", gridTemplateColumns: { md: "235px minmax(0, 1fr)" }, gap: { md: 5 } }}>
        <Box sx={{ display: { xs: "none", md: "block" } }}><Filters categories={categoryOptions} {...{ category, setCategory, price, setPrice }} /></Box>
        <Box>
          {wishlistError && <Alert severity="error" onClose={() => setWishlistError("")} sx={{ mb: 2 }}>{wishlistError}</Alert>}
          {cartError && <Alert severity="error" onClose={() => setCartError("")} sx={{ mb: 2 }}>{cartError}</Alert>}
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={1.5} sx={{ mb: 3 }}>
            <Typography color="text.secondary" variant="body2"><Box component="span" sx={{ color: "#000000", fontWeight: 800 }}><br/>{visibleProducts.length}</Box> products</Typography>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end" flexWrap="wrap" useFlexGap sx={{ ml: { sm: "auto" }, alignSelf: { xs: "flex-end", sm: "auto" } }}>
              <Button onClick={() => setMobileFilters(true)} startIcon={<SlidersHorizontal size={16} />} variant="outlined" sx={{ display: { md: "none" }, color: "#222", borderColor: "#d6d6d6", textTransform: "none", borderRadius: 1.5, height: 40 }}>Filter</Button>
              <FormControl size="small" sx={{ minWidth: 165, flexGrow: { xs: 1, sm: 0 }, marginLeft: 106 }}><Select value={sort} onChange={(e) => setSort(e.target.value)} sx={{ bgcolor: "white", borderRadius: 1.5, fontSize: ".88rem", height: 40 }}><MenuItem value="featured">Featured</MenuItem><MenuItem value="low">Price: low to high</MenuItem><MenuItem value="high">Price: high to low</MenuItem><MenuItem value="rating">Top rated</MenuItem></Select></FormControl>
              <Stack direction="row" spacing={0.25} sx={{ border: "1px solid #dedede", borderRadius: 1.5, bgcolor: "white", p: 0.25 }}><IconButton onClick={() => setView("grid")} color={view === "grid" ? "error" : "default"} aria-label="Grid view" sx={{ width: 34, height: 34 }}><Grid2X2 size={18} /></IconButton><IconButton onClick={() => setView("list")} color={view === "list" ? "error" : "default"} aria-label="List view" sx={{ width: 34, height: 34 }}><LayoutList size={19} /></IconButton></Stack>
            </Stack>
          </Stack>
          <TextField fullWidth value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search gear, helmets and more" sx={{ mb: 3.25, "& .MuiOutlinedInput-root": { bgcolor: "white", borderRadius: 1.5 } }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={19} color="#777" /></InputAdornment> } }} />
          <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 1.5, mb: 1.5 }}>{categoryOptions.slice(0, 5).map((item) => <Chip key={item} label={item} onClick={() => setCategory(item)} sx={{ fontWeight: category === item ? 750 : 500, bgcolor: category === item ? "#8b0000" : "white", color: category === item ? "white" : "#444", border: "1px solid", borderColor: category === item ? "#8b0000" : "#e2e2e2", "&:hover": { bgcolor: category === item ? "#700000" : "#f8f2f2" } }} />)}</Stack>
          {productsLoading ? <Box sx={{ textAlign: "center", py: 10, bgcolor: "white", borderRadius: 2, border: "1px solid #eee" }}><Typography color="text.secondary">Loading products…</Typography></Box> : visibleProducts.length ? <>
          <Box sx={{ display: "grid", gridTemplateColumns: view === "grid" ? { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" } : { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: { xs: 1.5, sm: 2.5 } }}>
            {paginatedProducts.map((product) => {
              const name = product.name || product.title || product.product_name || "Untitled product";
              const image = getProductImage(product);
              const productCategory = getProductCategory(product);
              const productPrice = getProductPrice(product);
              const oldPrice = Number(product.oldPrice ?? product.old_price ?? product.compare_at_price ?? 0);
              const rating = Number(product.rating || 0);
              const id = product.id ?? product.product_id ?? name;
              return <Box key={id} sx={{ position: "relative", display: view === "list" ? "flex" : "block", gap: 2, bgcolor: "#fff", borderRadius: 2, overflow: "hidden", border: "1px solid #ededed", transition: "transform .2s, box-shadow .2s", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 28px rgba(30,15,15,.09)" } }}>
              <Box component={RouterLink} to={`/products/${id}`} aria-label={`View ${name}`} sx={{ display: "block", position: "relative", width: view === "list" ? { xs: 130, sm: 210 } : "100%", flexShrink: 0, aspectRatio: view === "list" ? "1 / 1" : "1 / .88", overflow: "hidden", bgcolor: "#f2efed" }}>
                {image && <Box component="img" src={image} alt={name} sx={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />}
                {(product.tag || product.badge) && <Chip label={product.tag || product.badge} size="small" sx={{ position: "absolute", top: 10, left: 10, height: 23, bgcolor: "white", fontSize: ".66rem", fontWeight: 800 }} />}
              </Box>
              <IconButton onClick={() => toggleFavourite(id)} disabled={wishlistPending.includes(String(id)) || favourites.includes(String(id))} aria-label={favourites.includes(String(id)) ? `${name} saved to wishlist` : `Save ${name}`} sx={{ position: "absolute", top: 6, left: view === "list" ? { xs: 86, sm: 166 } : "auto", right: view === "list" ? "auto" : 6, bgcolor: "rgba(255,255,255,.9)", "&:hover": { bgcolor: "white" } }}><Heart size={18} fill={favourites.includes(String(id)) ? "#8b0000" : "none"} color={favourites.includes(String(id)) ? "#8b0000" : "#333"} /></IconButton>
              <Box sx={{ p: { xs: 1.35, sm: 1.8 }, minWidth: 0, flex: 1 }}><Typography variant="caption" sx={{ color: "#8b0000", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em" }}>{productCategory}</Typography><Typography component={RouterLink} to={`/products/${id}`} sx={{ display: "block", color: "#222", textDecoration: "none", fontWeight: 780, lineHeight: 1.3, mt: .35, minHeight: view === "grid" ? { xs: 42, sm: 44 } : 0, fontSize: { xs: ".88rem", sm: "1rem" }, "&:hover": { color: "#8b0000" } }}>{name}</Typography><Stack direction="row" alignItems="center" spacing={.5} sx={{ mt: .7 }}><Rating value={rating} precision={.1} readOnly size="small" sx={{ fontSize: ".9rem" }} /><Typography variant="caption" color="text.secondary">{product.reviews ?? product.review_count ?? 0}</Typography></Stack><Stack direction="row" alignItems="baseline" spacing={.8} sx={{ mt: .8 }}><Typography sx={{ fontWeight: 850, fontSize: { xs: ".98rem", sm: "1.1rem" } }}>{inr(productPrice)}</Typography>{oldPrice > 0 && <Typography variant="body2" sx={{ color: "#999", textDecoration: "line-through" }}>{inr(oldPrice)}</Typography>}</Stack><Button onClick={() => addToBag(id)} disabled={bagItems.includes(String(id)) || cartPending.includes(String(id))} startIcon={<ShoppingBag size={16} />} fullWidth={view === "grid"} sx={{ mt: 1.3, textTransform: "none", bgcolor: bagItems.includes(String(id)) ? "#e9f5ed" : "#8b0000", color: bagItems.includes(String(id)) ? "#28733c" : "white", px: 1.5, "&:hover": { bgcolor: bagItems.includes(String(id)) ? "#dff0e4" : "#700000" }, "&.Mui-disabled": { color: "#28733c" } }}>{bagItems.includes(String(id)) ? "Added to bag" : cartPending.includes(String(id)) ? "Adding…" : "Add to bag"}</Button></Box>
            </Box>;
            })}
          </Box>
          {pageCount > 1 && <Stack alignItems="center" sx={{ mt: 4 }}><Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} color="error" /></Stack>}
          </> : <Box sx={{ textAlign: "center", py: 10, bgcolor: "white", borderRadius: 2, border: "1px solid #eee" }}>{!productsLoading && <><Filter size={32} color="#8b0000" /><Typography fontWeight={800} sx={{ mt: 1.5 }}>No products found</Typography><Button onClick={() => { setCategory("All products"); setPrice([0, 8000]); setQuery(""); }} sx={{ mt: 1, color: "#8b0000", textTransform: "none" }}>Clear filters</Button></>}</Box>}
        </Box>
      </Box>
    </Container>
    <Drawer anchor="left" open={mobileFilters} onClose={() => setMobileFilters(false)} PaperProps={{ sx: { width: 310 } }}><Filters categories={categoryOptions} {...{ category, setCategory, price, setPrice }} close={() => setMobileFilters(false)} /></Drawer>
  </Box>;
}
