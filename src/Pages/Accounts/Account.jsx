import React, { useEffect, useState } from "react";
import {
    Alert,
    Avatar,
    Box,
    Chip,
    Container,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Stack,
    Typography,
    Button
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { useNavigate } from "react-router-dom";
import { adminDetails as fetchAdminDetails, getOrderList } from "../../Api/services/Services";

const emptyUser = { name: "", email: "", phone: "", location: "", memberSince: "", plan: "", status: "" };

function statusColor(status) {
    const map = {
        success: { bg: "#e8f5e9", text: "#2e7d32" },
        warning: { bg: "#fff8e1", text: "#b26a00" },
        error: { bg: "#fdecea", text: "#c62828" },
    };
    const value = status?.toLowerCase();
    if (["delivered", "completed"].includes(value)) return map.success;
    if (["cancelled", "canceled", "failed"].includes(value)) return map.error;
    return map.warning;
}

const formatOrderMoney = (value) => new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
}).format(Number(value) || 0);

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(emptyUser);
    const [loadingUser, setLoadingUser] = useState(true);
    const [userError, setUserError] = useState("");
    const [apiOrders, setApiOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState("");

    useEffect(() => {
        let active = true;
        fetchAdminDetails()
            .then((response) => {
                const details = response?.admin ?? response?.adminDetails ?? response?.user ?? response?.data?.admin ?? response?.data?.user ?? response?.data ?? response;
                if (!active) return;

                // Save the user id to localStorage
                const userId = details?.id ?? details?._id ?? details?.userId ?? details?.user_id;
                if (userId !== undefined && userId !== null) {
                    try {
                        localStorage.setItem("userId", String(userId));
                    } catch (e) {
                        console.error("Could not save userId to localStorage", e);
                    }
                }

                setUser({
                    name: details?.name ?? details?.fullName ?? "",
                    email: details?.email ?? "",
                    phone: details?.phone ?? details?.phoneNumber ?? "",
                    location: details?.location ?? "",
                    memberSince: details?.createdAt ? new Date(details.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "",
                    plan: details?.plan ?? details?.role ?? "",
                    status: details?.status ?? "",
                });
            })
            .catch((error) => {
                if (active) setUserError(error.response?.data?.message || "Could not load admin details.");
            })
            .finally(() => {
                if (active) setLoadingUser(false);
            });
        return () => { active = false; };
    }, []);
    
    useEffect(() => {
        let active = true;
        getOrderList()
            .then((response) => {
                if (active) setApiOrders(Array.isArray(response?.data) ? response.data : []);
            })
            .catch((error) => {
                if (active) setOrdersError(error.response?.data?.message || "Could not load your orders.");
            })
            .finally(() => {
                if (active) setLoadingOrders(false);
            });
        return () => { active = false; };
    }, []);

    const stats = [
        { label: "Total orders", value: loadingOrders ? "Loadingâ€¦" : String(apiOrders.length) },
        {
            label: "Total spent",
            value: loadingOrders ? "Loadingâ€¦" : formatOrderMoney(apiOrders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0)),
        },
        {
            label: "In progress",
            value: loadingOrders ? "Loadingâ€¦" : String(apiOrders.filter((order) => ["pending", "processing", "shipped", "in transit"].includes(order.status?.toLowerCase())).length),
        },
    ];

    const initials = user.name ? user.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() : "A";
    const shown = (value) => loadingUser ? "Loadingâ€¦" : value || "â€”";
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Avatar sx={{ width: 72, height: 72, bgcolor: "#e3edff", color: "#1565c0", fontWeight: 500, fontSize: 24 }}>
                    {initials}
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="h5" fontWeight={500}>
                        {shown(user.name)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {shown(user.email)}
                    </Typography>
                </Box>
                <Chip
                    label={shown(user.status)}
                    sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 500, display: user.status ? undefined : "none" }}
                />
            </Paper>

            {userError && <Typography role="alert" color="error" sx={{ mb: 2 }}>{userError}</Typography>}

            <Grid container spacing={3}>
                {/* Left column: account info + stats */}
                <Grid item xs={12} md={4}>
                    <Typography
                        variant="overline"
                        color="text.secondary"
                        sx={{ letterSpacing: 1, mb: 1, display: "block" }}
                    >
                        Account information
                    </Typography>
                    <Paper variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
                        <List disablePadding>
                            <ListItem divider>
                                <ListItemAvatar sx={{ minWidth: 36 }}>
                                    <PhoneIcon fontSize="small" color="action" />
                                </ListItemAvatar>
                                <ListItemText primary="Phone" />
                                <Typography variant="body2">{shown(user.phone)}</Typography>
                            </ListItem>
                            <ListItem divider>
                                <ListItemAvatar sx={{ minWidth: 36 }}>
                                    <LocationOnIcon fontSize="small" color="action" />
                                </ListItemAvatar>
                                <ListItemText primary="Location" />
                                <Typography variant="body2">{shown(user.location)}</Typography>
                            </ListItem>
                            <ListItem divider>
                                <ListItemAvatar sx={{ minWidth: 36 }}>
                                    <CalendarMonthIcon fontSize="small" color="action" />
                                </ListItemAvatar>
                                <ListItemText primary="Member since" />
                                <Typography variant="body2">{shown(user.memberSince)}</Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar sx={{ minWidth: 36 }}>
                                    <VerifiedUserIcon fontSize="small" color="action" />
                                </ListItemAvatar>
                                <ListItemText primary="Plan" />
                                <Typography variant="body2">{shown(user.plan)}</Typography>
                            </ListItem>
                        </List>
                    </Paper>

                    <Typography
                        variant="overline"
                        color="text.secondary"
                        sx={{ letterSpacing: 1, mb: 1, display: "block" }}
                    >
                        Summary
                    </Typography>
                    <Stack spacing={1.5}>
                        {stats.map((s) => (
                            <Paper
                                key={s.label}
                                elevation={0}
                                sx={{ p: 2, borderRadius: 2, bgcolor: "#f5f5f5" }}
                            >
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {s.label}
                                </Typography>
                                <Typography variant="h6" fontWeight={500}>
                                    {s.value}
                                </Typography>
                            </Paper>
                        ))}
                    </Stack>
                </Grid>

                {/* Right column: orders */}
                <Grid item xs={12} md={8}>
                    <Typography
                        variant="overline"
                        color="text.secondary"
                        sx={{ letterSpacing: 1, mb: 1, display: "block" }}
                    >
                        Recent orders
                    </Typography>
                    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden", width: "100%" }}>
                        {ordersError && <Alert severity="error" sx={{ m: 2 }}>{ordersError}</Alert>}
                        <List disablePadding>
                            {loadingOrders && <ListItem><ListItemText primary="Loading ordersâ€¦" /></ListItem>}
                            {!loadingOrders && !ordersError && apiOrders.length === 0 && (
                                <ListItem><ListItemText primary="No orders yet" /></ListItem>
                            )}
                            {apiOrders.map((order, idx) => {
                                const c = statusColor(order.status);
                                return (
                                    <React.Fragment key={order.id}>
                                        <ListItem sx={{ py: 2 }}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    variant="rounded"
                                                    sx={{ bgcolor: c.bg, color: c.text, width: 44, height: 44 }}
                                                >
                                                    <Inventory2Icon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`Order #${order.order_number || order.id}`}
                                                secondary={`${order.shipping_city || ""}${order.shipping_state ? `, ${order.shipping_state}` : ""} Â· ${order.payment_method || ""} Â· ${formatOrderMoney(order.total_amount)}`}
                                                primaryTypographyProps={{ fontSize: 15, fontWeight: 500 }}
                                                secondaryTypographyProps={{ fontSize: 13 }}
                                            />
                                            <Chip
                                                size="small"
                                                label={order.status || "Unknown"}
                                                sx={{ mr: 1, bgcolor: c.bg, color: c.text, textTransform: "capitalize" }}
                                            />
                                            <Button
                                                sx={{ color: "#000", border: "1px solid black" }}
                                                onClick={() => navigate(`/order-details/${order.id}`)}
                                            >
                                                Explore
                                            </Button>
                                        </ListItem>
                                        {idx < apiOrders.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

