import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Container, Divider, Stack, ThemeProvider, Typography, createTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import { cartList } from "../../Api/services/Services";

const theme = createTheme({
    palette: { background: { default: "#F7F7F7" }, primary: { main: "#BC0507", dark: "#8F0002" }, text: { primary: "#000000", secondary: "#555555" }, divider: "#C0C0C0" },
    typography: { fontFamily: '"Roboto", sans-serif', h1: { fontFamily: '"Slabo 13px", serif' }, h2: { fontFamily: '"Slabo 13px", serif' }, h3: { fontFamily: '"Slabo 13px", serif' }, h4: { fontFamily: '"Slabo 13px", serif' }, h5: { fontFamily: '"Slabo 13px", serif' }, h6: { fontFamily: '"Slabo 13px", serif' } },
    shape: { borderRadius: 8 },
});

const rupees = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const getCartPayload = (response) => {
    const payload = response?.data ?? response;
    return payload?.data ?? payload;
};

function ProductCard({ item, onRemove }) {
    const itemId = item.cart_item_id ?? item.product_id;
    const image = item.image || item.image_url || item.images?.[0]?.url || item.images?.[0];
    return <Box sx={{ border: "1px solid #d6d7e4", borderRadius: 1.25, overflow: "hidden" }}>
        <Stack direction="row" spacing={1.75} sx={{ p: { xs: 1.5, sm: 2 } }}>
            {image ? <Box component="img" src={image} alt={item.name} sx={{ width: 64, height: 64, flexShrink: 0, borderRadius: 1, objectFit: "cover" }} /> : <Box role="img" aria-label="No product image available" sx={{ width: 64, height: 64, flexShrink: 0, borderRadius: 1, bgcolor: "#f1f1f1" }} />}
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                    <Box>
                        <Typography sx={{ fontSize: 16, fontWeight: 600, lineHeight: 1.35 }}>{item.name}</Typography>
                        <Stack direction="row" spacing={0.65} alignItems="baseline" sx={{ mt: 0.6 }}>
                            <Typography sx={{ fontSize: 17, fontWeight: 600 }}>{rupees(item.price)}</Typography>
                            {Number(item.compare_at_price) > Number(item.price) && <Typography sx={{ fontSize: 12, color: "#888a9c", textDecoration: "line-through" }}>{rupees(item.compare_at_price)}</Typography>}
                        </Stack>
                    </Box>
                </Stack>
                <Typography sx={{ mt: 1.1, fontSize: 15 }}>Qty: {item.quantity}</Typography>
                <Button startIcon={<CloseRoundedIcon sx={{ fontSize: 16 }} />} onClick={() => onRemove(itemId)} sx={{ mt: 0.7, px: 0, minHeight: 28, color: "#555a71", fontSize: 14, fontWeight: 600, "&:hover": { bgcolor: "transparent", color: "#8F0002" } }}>REMOVE</Button>
            </Box>
        </Stack>
        {item.sku && <><Divider /><Typography sx={{ px: 2, py: 1.3, color: "#535870", fontSize: 15 }}>SKU: {item.sku}</Typography></>}
    </Box>;
}

function PriceRow({ label, value, dotted, green, bold }) {
    return <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontSize: bold ? 18 : 15, fontWeight: bold ? 600 : 400, color: green ? "#008d67" : "#626477", textDecoration: dotted ? "underline dotted" : "none" }}>{label}</Typography>
        <Typography sx={{ fontSize: bold ? 19 : 15, fontWeight: bold ? 700 : 400, color: green ? "#008d67" : "#343647" }}>{value}</Typography>
    </Stack>;
}

function SafetyCard() {
    return <Box sx={{ mt: 1.6, minHeight: 118, borderBottom: "2px solid #eeeef4", p: 1.5, position: "relative", overflow: "hidden" }}>
        <Stack direction="row" alignItems="center" spacing={0.7} sx={{ color: "#504cbd" }}><LocalOfferRoundedIcon sx={{ fontSize: 24 }} /><Typography sx={{ fontWeight: 700, fontSize: 12 }}>Meesho Safe</Typography></Stack>
        <Typography sx={{ mt: 1.1, fontWeight: 700, color: "#373583", fontSize: 14 }}>Your Safety, Our Priority</Typography>
        <Typography sx={{ mt: 0.5, color: "#373583", fontSize: 13, maxWidth: "64%" }}>We make sure that your package is safe at every point of contact.</Typography>
        <Box sx={{ position: "absolute", right: 18, bottom: -7, fontSize: 52 }}>📦</Box><Box sx={{ position: "absolute", right: 23, top: 29, fontSize: 32 }}>🛡️</Box>
    </Box>;
}

function PriceDetails({ items, subtotal, totalItems, totalQuantity }) {
    const productPrice = items.reduce((total, item) => total + Number(item.compare_at_price ?? item.price) * Number(item.quantity || 0), 0);
    const discount = Math.max(productPrice - subtotal, 0);
    return <Box sx={{ borderLeft: { md: "1px solid #d2d3df" }, pl: { md: 3.2 }, minHeight: { md: 330 } }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1.75 }}>Cart Summary</Typography>
        <Stack spacing={1.45}><PriceRow label="Items" value={totalItems} /><PriceRow label="Total quantity" value={totalQuantity} /><PriceRow label="Product Price" value={`+ ${rupees(productPrice)}`} dotted /><PriceRow label="Total Discounts" value={`- ${rupees(discount)}`} dotted green /></Stack>
        <Divider sx={{ my: 2.1, borderColor: "#c9cad7", borderBottomWidth: 2 }} />
        <PriceRow label="Order Total" value={rupees(subtotal)} bold />
        <Alert icon={<VerifiedUserRoundedIcon fontSize="inherit" />} severity="success" sx={{ mt: 1.8, bgcolor: "#d8f6ed", color: "#008c65", fontSize: 15, py: 0.35, alignItems: "center", "& .MuiAlert-icon": { color: "#008c65" } }}>Yay! Your total discount is {rupees(discount)}</Alert>
        <Box sx={{ mt: 2, bgcolor: "#f6f6fb", px: 1.5, py: 1.1, textAlign: "center" }}><Typography sx={{ fontSize: 13, color: "#383a4e" }}>Clicking on 'Continue' will not deduct any money</Typography></Box>
        <Button component={RouterLink} to="/checkout" fullWidth variant="contained" disableElevation sx={{ height: 48, borderRadius: 0.5, fontSize: 17, fontWeight: 700 }}>Continue</Button>
        <SafetyCard />
    </Box>;
}

export default function CartPage() {
    const [items, setItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const loadCart = useCallback(async (isCancelled = () => false) => {
        setLoading(true);
        setError("");
        try {
            const cart = getCartPayload(await cartList());
            if (isCancelled()) return;
            const cartItems = Array.isArray(cart?.items) ? cart.items : [];
            setItems(cartItems);
            setSubtotal(Number(cart?.subtotal ?? 0));
            setTotalItems(Number(cart?.total_items ?? cartItems.length));
            setTotalQuantity(Number(cart?.total_quantity ?? cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0)));
        } catch (err) {
            if (!isCancelled()) setError(err?.response?.data?.message || err?.message || "Unable to load your cart.");
        } finally {
            if (!isCancelled()) setLoading(false);
        }
    }, []);
    useEffect(() => {
        let cancelled = false;
        loadCart(() => cancelled);
        return () => { cancelled = true; };
    }, [loadCart]);
    const removeItem = (id) => setItems((current) => current.filter((product) => (product.cart_item_id ?? product.product_id) !== id));

    return <ThemeProvider theme={theme}><Box sx={{ minHeight: "100vh", bgcolor: "#fff", py: { xs: 2, md: 3 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 } }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 5, md: 3 }} alignItems="flex-start">
                <Box sx={{ width: { xs: "100%", md: "63%" } }}><Typography sx={{ mb: 1.5, fontSize: 18, fontWeight: 700 }}>Product Details</Typography>{loading ? <Stack alignItems="center" sx={{ py: 5 }}><CircularProgress color="error" /></Stack> : error ? <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => loadCart()}>Retry</Button>}>{error}</Alert> : items.length ? <Stack spacing={2}>{items.map((item) => <ProductCard key={item.cart_item_id ?? item.product_id} item={item} onRemove={removeItem} />)}</Stack> : <Typography>Your cart is empty.</Typography>}</Box>
                {!loading && !error && items.length > 0 && <Box sx={{ width: { xs: "100%", md: "37%" } }}><PriceDetails items={items} subtotal={subtotal} totalItems={totalItems} totalQuantity={totalQuantity} /></Box>}
            </Stack>
        </Container>
    </Box></ThemeProvider>;
}
