import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Grid,
    IconButton,
    LinearProgress,
    CircularProgress,
    Link,
    Paper,
    Stack,
    Step,
    StepConnector,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    createTheme,
    stepConnectorClasses,
    ThemeProvider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { getOrderDetailsbyId, trackShiprocketShipment } from "../../Api/services/Services";

// Design tokens

const tokens = {
    ink: "#101B33", 
    slate: "#5B6472", // secondary text
    canvas: "#F4F6FA", // page background
    paper: "#FFFFFF",
    line: "#E5E8F0",
    gold: "#B08D57", // signature accent
    amber: "#B7791F", // in-transit
    amberBg: "#FCF3E3",
    green: "#1B7A4D",
    greenBg: "#E8F5EE",
    red: "#B23B3B",
    redBg: "#FBEBEB",
};

const statusStyles = {
    "In transit": { fg: tokens.amber, bg: tokens.amberBg },
    Delivered: { fg: tokens.green, bg: tokens.greenBg },
    Cancelled: { fg: tokens.red, bg: tokens.redBg },
    pending: { fg: tokens.amber, bg: tokens.amberBg },
    processing: { fg: tokens.amber, bg: tokens.amberBg },
    shipped: { fg: tokens.amber, bg: tokens.amberBg },
    delivered: { fg: tokens.green, bg: tokens.greenBg },
    completed: { fg: tokens.green, bg: tokens.greenBg },
    cancelled: { fg: tokens.red, bg: tokens.redBg },
};

// Single spacing scale so every card block in both columns shares the same
// rhythm â€” this is what keeps the two columns visually aligned as they run
// down the page.
const SECTION_GAP = 4;

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: tokens.ink },
        background: { default: tokens.canvas, paper: tokens.paper },
        text: { primary: tokens.ink, secondary: tokens.slate },
        divider: tokens.line,
    },
    shape: { borderRadius: 14 },
    typography: {
        fontFamily: '"Roboto", sans-serif',
        h4: { fontFamily: '"Slabo 13px", serif', fontWeight: 600, letterSpacing: -0.5 },
        h5: { fontFamily: '"Slabo 13px", serif', fontWeight: 600, letterSpacing: -0.3 },
        h6: { fontFamily: '"Slabo 13px", serif', fontWeight: 600 },
        overline: { letterSpacing: 1.4, fontWeight: 600 },
    },
    components: {
        MuiButton: { styleOverrides: { root: { textTransform: "none", fontWeight: 600 } } },
        MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    },
});

const mono = '"Roboto", sans-serif';


// Tracker
const stepIcons = [ReceiptLongOutlinedIcon, Inventory2OutlinedIcon, LocalShippingOutlinedIcon, LocalShippingOutlinedIcon, HomeOutlinedIcon];

const Connector = styled(StepConnector)(() => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 17 },
    [`& .${stepConnectorClasses.line}`]: { borderColor: tokens.line, borderTopWidth: 2 },
    [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: { borderColor: tokens.ink },
    [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: { borderColor: tokens.ink },
}));

function StepIcon(props) {
    const { active, completed, icon } = props;
    const Icon = stepIcons[icon - 1];
    const done = completed;
    return (
        <Box
            sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: done || active ? tokens.ink : tokens.paper,
                color: done || active ? "#fff" : tokens.slate,
                border: done || active ? "none" : `2px solid ${tokens.line}`,
                boxShadow: active ? `0 0 0 4px ${tokens.gold}33` : "none",
                transition: "box-shadow .2s ease",
            }}
        >
            <Icon sx={{ fontSize: 17 }} />
        </Box>
    );
}

// Small building blocks
function Eyebrow({ children }) {
    return (
        <Typography variant="overline" sx={{ color: tokens.slate, display: "block", mb: 1 }}>
            {children}
        </Typography>
    );
}

function SectionCard({ children, sx = {} }) {
    return (
        <Paper variant="outlined" sx={{ borderColor: tokens.line, borderRadius: 3, p: { xs: 2.5, md: 3.5 }, ...sx }}>
            {children}
        </Paper>
    );
}

export default function OrderDetailsPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [trackingLoading, setTrackingLoading] = useState(false);
    const [trackingError, setTrackingError] = useState("");
    const [trackingResult, setTrackingResult] = useState("");

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError("");
        getOrderDetailsbyId(id)
            .then((response) => {
                if (!active) return;
                const details = response?.data || {};
                const rawOrder = details.order;
                if (!rawOrder) throw new Error(response?.message || "Order details were not found.");
                const rawStatus = String(rawOrder.status || "pending");
                const status = rawStatus.toLowerCase();
                const stepIndex = ["delivered", "completed"].includes(status) ? 4
                    : ["shipped", "in transit"].includes(status) ? 2
                        : ["processing", "confirmed"].includes(status) ? 1 : 0;
                const placedDate = rawOrder.created_at
                    ? new Date(rawOrder.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
                    : "—";
                setOrder({
                    id: rawOrder.order_number || rawOrder.id,
                    placedOn: placedDate,
                    status: rawStatus,
                    awb: rawOrder.awb_code || rawOrder.awb || rawOrder.awb_number || rawOrder.shipment_awb || rawOrder.shipment?.awb_code || rawOrder.shipment?.awb || "",
                    eta: status === "delivered" ? "Delivered" : "Not available",
                    paymentMethod: rawOrder.payment_method || "—",
                    paymentStatus: rawOrder.payment_status || "—",
                    subtotal: Number(rawOrder.subtotal) || 0,
                    shipping: Number(rawOrder.shipping_charge) || 0,
                    discount: Number(rawOrder.discount_amount) || 0,
                    total: Number(rawOrder.total_amount) || 0,
                    address: {
                        name: rawOrder.shipping_name || "",
                        line: rawOrder.shipping_address || "",
                        city: [rawOrder.shipping_city, rawOrder.shipping_state, rawOrder.shipping_pincode].filter(Boolean).join(", "),
                        phone: rawOrder.shipping_phone || "",
                        email: rawOrder.shipping_email || "",
                    },
                    items: (Array.isArray(details.items) ? details.items : []).map((item) => ({
                        id: item.id,
                        name: item.product_name || "Product",
                        qty: Number(item.quantity) || 0,
                        unit: Number(item.price) || 0,
                        total: Number(item.total_price) || 0,
                        sku: item.sku || "—",
                    })),
                    tracking: {
                        current: stepIndex,
                        steps: [
                            { label: "Placed", date: placedDate },
                            { label: "Processing", date: stepIndex > 0 ? "Complete" : "Pending" },
                            { label: "Shipped", date: stepIndex > 2 ? "Complete" : "Pending" },
                            { label: "Out for delivery", date: "Pending" },
                            { label: "Delivered", date: status === "delivered" ? placedDate : "Pending" },
                        ],
                    },
                });
            })
            .catch((requestError) => {
                if (active) setError(requestError.response?.data?.message || requestError.message || "Could not load order details.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => { active = false; };
    }, [id]);

    const fmt = (value) => new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(value) || 0);

    if (loading) return <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
    if (error || !order) return <Container maxWidth="md" sx={{ py: 6 }}><Alert severity="error">{error || "Order details were not found."}</Alert></Container>;

    const statusStyle = statusStyles[order.status] || statusStyles[order.status.toLowerCase()] || statusStyles["In transit"];
    const progressPct = (order.tracking.current / (order.tracking.steps.length - 1)) * 100;
    const subtotal = order.subtotal;
    const total = order.total;

    const refreshShipmentTracking = async () => {
        setTrackingLoading(true);
        setTrackingError("");
        setTrackingResult("");
        try {
            const response = await trackShiprocketShipment(order.awb);
            const data = response?.data || {};
            const tracking = data?.tracking_data || data;
            const latestScan = tracking?.shipment_track?.[0] || tracking?.shipment_track_activities?.[0] || {};
            const status = tracking?.shipment_status || tracking?.track_status || tracking?.current_status || latestScan?.activity || response?.message;
            const location = latestScan?.location ? ` · ${latestScan.location}` : "";
            setTrackingResult(status ? `Shipment status: ${status}${location}` : "Tracking information received.");
        } catch (trackingRequestError) {
            setTrackingError(trackingRequestError.response?.data?.message || trackingRequestError.message || "Could not retrieve tracking.");
        } finally {
            setTrackingLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: tokens.canvas, minHeight: "100vh", fontFamily: theme.typography.fontFamily }}>
                <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2.5, sm: 4, lg: 6 }, py: { xs: 4, md: 6 } }}>
                    {/* Breadcrumb */}
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 3 }}>
                        <Link underline="hover" sx={{ fontSize: 13, color: tokens.slate, fontWeight: 500 }}>
                            Orders
                        </Link>
                        <ChevronRightIcon sx={{ fontSize: 15, color: tokens.slate }} />
                        <Typography sx={{ fontSize: 13, color: tokens.ink, fontWeight: 600, fontFamily: mono }}>
                            #{order.id}
                        </Typography>
                    </Stack>

                    {/* Header */}
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "flex-end" }}
                        spacing={2}
                        sx={{ mb: 5, pb: 4, borderBottom: `1px solid ${tokens.line}` }}
                    >
                        <Box>
                            <Typography variant="h4" sx={{ mb: 0.75 }}>
                                Order #{order.id}
                            </Typography>
                            <Typography variant="body2" sx={{ color: tokens.slate }}>
                                Placed {order.placedOn} Â· {order.items.length} item{order.items.length > 1 ? "s" : ""} · Payment {order.paymentMethod} ({order.paymentStatus})
                            </Typography>
                        </Box>
                        <Chip
                            label={
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: statusStyle.fg }} />
                                    <span>{order.status}</span>
                                </Stack>
                            }
                            sx={{
                                bgcolor: statusStyle.bg,
                                color: statusStyle.fg,
                                fontWeight: 600,
                                px: 1,
                                height: 32,
                                "& .MuiChip-label": { px: 1 },
                            }}
                        />
                    </Stack>

                    {/*
            Both columns are built as a stack of equal-gap blocks
            (SECTION_GAP) with NO block-specific leading label outside the
            card in the first slot â€” that's what keeps the top edge of the
            left column's first card and the right column's first card
            flush with each other. Any label a card needs lives inside its
            own padding instead of floating above it.
          */}
                    <Grid container spacing={4} alignItems="flex-start">
                        {/* ---------------- Left column ---------------- */}
                        <Grid item xs={12} md={8}>
                            <Stack spacing={SECTION_GAP}>
                                {/* Shipment progress */}
                                <SectionCard>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                                        <Box>
                                            <Typography variant="h6">Shipment progress</Typography>
                                            <Typography variant="body2" sx={{ color: tokens.slate, mt: 0.25 }}>
                                                Arriving by <strong style={{ color: tokens.ink }}>{order.eta}</strong>
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <LinearProgress
                                        variant="determinate"
                                        value={progressPct}
                                        sx={{
                                            height: 4,
                                            borderRadius: 2,
                                            my: 3,
                                            bgcolor: tokens.line,
                                            "& .MuiLinearProgress-bar": { bgcolor: tokens.gold, borderRadius: 2 },
                                        }}
                                    />

                                    <Stepper alternativeLabel activeStep={order.tracking.current} connector={<Connector />}>
                                        {order.tracking.steps.map((step) => (
                                            <Step key={step.label}>
                                                <StepLabel StepIconComponent={StepIcon}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.75 }}>
                                                        {step.label}
                                                    </Typography>
                                                    <Typography sx={{ fontFamily: mono, fontSize: 11.5, color: tokens.slate, mt: 0.25 }}>
                                                        {step.date}
                                                    </Typography>
                                                </StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>

                                    {order.awb && <Button
                                        variant="outlined"
                                        startIcon={<LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />}
                                        onClick={refreshShipmentTracking}
                                        disabled={trackingLoading}
                                        sx={{ mt: 4, borderRadius: 2, borderColor: tokens.line, color: tokens.ink, "&:hover": { borderColor: tokens.ink, bgcolor: "transparent" } }}
                                    >
                                        {trackingLoading ? "Loading tracking…" : `Track shipment · ${order.awb}`}
                                    </Button>}
                                    {trackingError && <Alert severity="error" sx={{ mt: 2 }}>{trackingError}</Alert>}
                                    {trackingResult && <Alert severity="info" sx={{ mt: 2 }}>{trackingResult}</Alert>}
                                </SectionCard>

                                {/* Items */}
                                <Box>
                                    <Eyebrow>Items in this order</Eyebrow>
                                    <SectionCard sx={{ p: 0, overflow: "hidden" }}>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        {["Item", "SKU", "Qty", "Unit price", "Subtotal"].map((h, i) => (
                                                            <TableCell
                                                                key={h}
                                                                align={i >= 2 ? "right" : "left"}
                                                                sx={{
                                                                    borderColor: tokens.line,
                                                                    color: tokens.slate,
                                                                    fontSize: 11.5,
                                                                    fontWeight: 700,
                                                                    letterSpacing: 1,
                                                                    textTransform: "uppercase",
                                                                    bgcolor: "#FAFBFD",
                                                                }}
                                                            >
                                                                {h}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {order.items.map((item) => (
                                                        <TableRow key={item.id || item.sku}>
                                                            <TableCell sx={{ borderColor: tokens.line, py: 2 }}>
                                                                <Stack direction="row" spacing={1.75} alignItems="center">
                                                                    <Avatar variant="rounded" sx={{ bgcolor: tokens.canvas, color: tokens.ink, width: 40, height: 40 }}>
                                                                        <Inventory2OutlinedIcon sx={{ fontSize: 19 }} />
                                                                    </Avatar>
                                                                    <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>{item.name}</Typography>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell sx={{ borderColor: tokens.line, fontFamily: mono, fontSize: 12.5, color: tokens.slate }}>
                                                                {item.sku}
                                                            </TableCell>
                                                            <TableCell align="right" sx={{ borderColor: tokens.line, fontSize: 14 }}>
                                                                {item.qty}
                                                            </TableCell>
                                                            <TableCell align="right" sx={{ borderColor: tokens.line, fontSize: 14, fontFamily: mono }}>
                                                                {fmt(item.unit)}
                                                            </TableCell>
                                                            <TableCell align="right" sx={{ borderColor: tokens.line, fontSize: 14, fontWeight: 600, fontFamily: mono }}>
                                                                {fmt(item.total || item.unit * item.qty)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        <Stack sx={{ p: 3, pt: 2.5, borderTop: `1px solid ${tokens.line}` }} spacing={1} alignItems="flex-end">
                                            <Stack direction="row" spacing={6}>
                                                <Typography variant="body2" sx={{ color: tokens.slate, width: 90 }}>Subtotal</Typography>
                                                <Typography variant="body2" sx={{ fontFamily: mono }}>{fmt(subtotal)}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={6}>
                                                <Typography variant="body2" sx={{ color: tokens.slate, width: 90 }}>Discount</Typography>
                                                <Typography variant="body2" sx={{ fontFamily: mono, color: tokens.green }}>− {fmt(order.discount)}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={6}>
                                                <Typography variant="body2" sx={{ color: tokens.slate, width: 90 }}>Shipping</Typography>
                                                <Typography variant="body2" sx={{ fontFamily: mono, color: tokens.green, fontWeight: 600 }}>
                                                    {order.shipping === 0 ? "Free" : fmt(order.shipping)}
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={6} sx={{ pt: 1, mt: 0.5, borderTop: `1px solid ${tokens.line}`, width: "auto" }}>
                                                <Typography sx={{ width: 90, fontWeight: 700 }}>Total</Typography>
                                                <Typography sx={{ fontFamily: mono, fontWeight: 700, fontSize: 15.5 }}>{fmt(total)}</Typography>
                                            </Stack>
                                        </Stack>
                                    </SectionCard>
                                </Box>
                            </Stack>
                        </Grid>

                        {/* ---------------- Right column ---------------- */}
                        <Grid item xs={12} md={4}>
                            <Stack spacing={SECTION_GAP}>
                                <Box
                                    sx={{
                                        position: "relative",
                                        bgcolor: tokens.paper,
                                        border: `1px solid ${tokens.line}`,
                                        borderRadius: 3,
                                        overflow: "hidden",
                                    }}
                                >
                                    <Stack spacing={1.5} sx={{ p: 3 }}>
                                        <Typography variant="overline" sx={{ color: tokens.slate, mb: 0.5 }}>
                                            Order summary
                                        </Typography>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2" sx={{ color: tokens.slate }}>Order ID</Typography>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Typography sx={{ fontFamily: mono, fontSize: 13.5, fontWeight: 600 }}>{order.id}</Typography>
                                                <IconButton size="small" sx={{ color: tokens.slate }}>
                                                    <ContentCopyOutlinedIcon sx={{ fontSize: 14 }} />
                                                </IconButton>
                                            </Stack>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" sx={{ color: tokens.slate }}>
                                                <PaymentOutlinedIcon sx={{ fontSize: 15, verticalAlign: "-2.5px", mr: 0.75 }} />
                                                Payment
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{order.paymentMethod}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" sx={{ color: tokens.slate }}>Payment status</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 500, textTransform: "capitalize" }}>{order.paymentStatus}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" sx={{ color: tokens.slate }}>Date placed</Typography>
                                            <Typography sx={{ fontFamily: mono, fontSize: 13 }}>{order.placedOn}</Typography>
                                        </Stack>
                                    </Stack>

                                    {/* perforation */}
                                    <Box sx={{ position: "relative", height: 0 }}>
                                        <Box sx={{ position: "absolute", left: -10, top: -10, width: 20, height: 20, borderRadius: "50%", bgcolor: tokens.canvas }} />
                                        <Box sx={{ position: "absolute", right: -10, top: -10, width: 20, height: 20, borderRadius: "50%", bgcolor: tokens.canvas }} />
                                        <Box sx={{ borderTop: `1.5px dashed ${tokens.line}`, mx: 2.5 }} />
                                    </Box>

                                    <Stack spacing={0.5} sx={{ p: 3, pt: 2.5 }}>
                                        <Typography variant="body2" sx={{ color: tokens.slate }}>Order total</Typography>
                                        <Typography variant="h4" sx={{ display: "inline-block" }}>
                                            {fmt(total)}
                                        </Typography>
                                        <Box sx={{ width: 36, height: 3, bgcolor: tokens.gold, borderRadius: 2, mt: 1 }} />
                                    </Stack>
                                </Box><br />

                                {/* Address */}
                                <Box sx={{ mt: 5 }}>
                                    <Eyebrow>Delivery address</Eyebrow>
                                    <SectionCard>
                                        <Stack direction="row" spacing={1.75}>
                                            <LocationOnOutlinedIcon
                                                sx={{
                                                    color: tokens.slate,
                                                    fontSize: 20,
                                                    mt: 0.3
                                                }}
                                            />

                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: 14.5
                                                    }}
                                                >
                                                    {order.address.name}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: tokens.slate,
                                                        mt: 0.5,
                                                        lineHeight: 1.6
                                                    }}
                                                >
                                                    {order.address.line}
                                                    <br />
                                                    {order.address.city}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        fontFamily: mono,
                                                        fontSize: 13,
                                                        color: tokens.slate,
                                                        mt: 1
                                                    }}
                                                >
                                                    {order.address.phone}
                                                </Typography>
                                                <Typography sx={{ fontSize: 13, color: tokens.slate, mt: 0.5 }}>{order.address.email}</Typography>
                                            </Box>
                                        </Stack>
                                    </SectionCard>
                                </Box>

                                {/* Actions */}
                                <Stack spacing={1.5}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        disableElevation
                                        startIcon={<HelpOutlineOutlinedIcon sx={{ fontSize: 18 }} />}
                                        sx={{ bgcolor: tokens.ink, borderRadius: 2, py: 1.2, "&:hover": { bgcolor: "#0A1224" } }}
                                    >
                                        Get help with this order
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
                                        sx={{ borderColor: tokens.line, color: tokens.ink, borderRadius: 2, py: 1.2, "&:hover": { borderColor: tokens.ink, bgcolor: "transparent" } }}
                                    >
                                        Download invoice
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="text"
                                        sx={{ color: tokens.red, borderRadius: 2, py: 1, "&:hover": { bgcolor: tokens.redBg } }}
                                    >
                                        Cancel order
                                    </Button>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
