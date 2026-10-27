import React, { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Box,
    IconButton,
    Badge,
    Divider,
    Typography,
    Tooltip,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Button,
} from "@mui/material";

// ===============================
// INLINE SVG ICONS
// ===============================

const SearchIcon = (props) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <circle cx="11" cy="11" r="7.5" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
);

const PersonOutlineIcon = (props) => (
    <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
);

const FavoriteBorderIcon = (props) => (
    <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M20.8 8.9c0 5.5-8.8 10.1-8.8 10.1S3.2 14.4 3.2 8.9C3.2 5.8 5.3 4 8 4c1.6 0 3.1.8 4 2.1C12.9 4.8 14.4 4 16 4c2.7 0 4.8 1.8 4.8 4.9Z" />
    </svg>
);

const ShoppingBagOutlinedIcon = (props) => (
    <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M6 8h12l-1 13H7L6 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
);

const MenuIcon = (props) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
);

const CloseIcon = (props) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

// ===============================
// NAVIGATION
// ===============================
// Each entry now carries the route it should point to. Adjust these
// paths to match your router setup (React Router shown below).

const NAV_LINKS = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Products", path: "/products" },
    { label: "Contact Us", path: "/contact" },
    { label: "Blogs", path: "/blogs" },
];

// Paths for the icon actions on the right side of the navbar.
const ACTION_PATHS = {
    search: "/search",
    account: "/account-setting",
    wishlist: "/wishlist",
    cart: "/cart",
};

// ===============================
// COMPONENT
// ===============================

export default function Navbar() {
    const [cartCount] = useState(2);
    const [wishlistCount] = useState(3);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Active link is derived from the current URL instead of local
    // state, so the underline follows the actual page you're on.
    const location = useLocation();
    const isActivePath = (path) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: "#FFFFFF",
                    color: "#000000",
                    borderBottom: "1px solid #C0C0C0",
                    zIndex: 1200,
                }}
            >
                <Toolbar
                    sx={{
                        minHeight: { xs: 72, md: 86 },
                        px: {
                            xs: 2,
                            sm: 3,
                            md: 5,
                            lg: 8,
                        },
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 1, md: 2 },
                    }}
                >
                    {/* ================= LOGO ================= */}

                    <Box
                        component={RouterLink}
                        to="/"
                        aria-label="GearUp Moto Home"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                            flexShrink: 0,
                            mr: { xs: 0, md: 3 },
                        }}
                    >
                        <Box
                            component="img"
                            src="/assets/logo.png"
                            alt="GearUp Moto"
                            sx={{
                                height: {
                                    xs: 52,
                                    sm: 58,
                                    md: 114,
                                },
                                width: "auto",
                                display: "block",
                                transition: "transform 0.25s ease",

                                "&:hover": {
                                    transform: "scale(1.03)",
                                },
                            }}
                        />
                    </Box>

                    {/* ================= DESKTOP NAV ================= */}

                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                md: "flex",
                            },
                            alignItems: "center",
                            height: "100%",
                            gap: {
                                md: 2.5,
                                lg: 3.5,
                            },
                        }}
                    >
                        {NAV_LINKS.map(({ label, path }) => {
                            const isActive = isActivePath(path);

                            return (
                                <Box
                                    key={label}
                                    component={RouterLink}
                                    to={path}
                                    sx={{
                                        position: "relative",
                                        border: "none",
                                        background: "transparent",
                                        cursor: "pointer",
                                        px: 0.5,
                                        py: 3.5,

                                        textDecoration: "none",
                                        color: isActive ? "#BC0507" : "#000000",

                                        fontFamily: "inherit",
                                        fontSize: {
                                            md: "0.88rem",
                                            lg: "0.92rem",
                                        },
                                        fontWeight: isActive ? 700 : 600,

                                        letterSpacing: "0.02em",

                                        transition:
                                            "color 0.25s ease, transform 0.25s ease",

                                        "&:hover": {
                                            color: "#BC0507",
                                            transform: "translateY(-1px)",
                                        },

                                        "&::after": {
                                            content: '""',
                                            position: "absolute",
                                            left: 0,
                                            right: 0,
                                            bottom: 20,
                                            height: "2px",
                                            borderRadius: "10px",
                                            backgroundColor: "#BC0507",

                                            transform: isActive
                                                ? "scaleX(1)"
                                                : "scaleX(0)",

                                            transformOrigin: "center",

                                            transition:
                                                "transform 0.25s ease",
                                        },

                                        "&:hover::after": {
                                            transform: "scaleX(1)",
                                        },
                                    }}
                                >
                                    {label}
                                </Box>
                            );
                        })}
                    </Box>

                    {/* ================= SPACER ================= */}

                    <Box sx={{ flexGrow: 1 }} />

                    {/* ================= DESKTOP ACTIONS ================= */}

                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                sm: "flex",
                            },
                            alignItems: "center",
                            gap: 0.3,
                        }}
                    >
                        {/* Search */}

                        <Tooltip title="Search" arrow>
                            <IconButton
                                component={RouterLink}
                                to={ACTION_PATHS.search}
                                aria-label="Search"
                                sx={{
                                    width: 42,
                                    height: 42,
                                    color: "#222",

                                    transition:
                                        "all 0.2s ease",

                                    "&:hover": {
                                        color: "#8B0000",
                                        bgcolor: "#faf3f3",
                                    },
                                }}
                            >
                                <SearchIcon />
                            </IconButton>
                        </Tooltip>

                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                                height: 26,
                                alignSelf: "center",
                                borderColor: "#e5e5e5",
                                mx: 0.5,
                            }}
                        />

                        {/* Account */}

                        <Tooltip title="My Account" arrow>
                            <IconButton
                                component={RouterLink}
                                to={ACTION_PATHS.account}
                                aria-label="My Account"
                                sx={{
                                    width: 42,
                                    height: 42,
                                    color: "#222",

                                    transition:
                                        "all 0.2s ease",

                                    "&:hover": {
                                        color: "#8B0000",
                                        bgcolor: "#faf3f3",
                                    },
                                }}
                            >
                                <PersonOutlineIcon />
                            </IconButton>
                        </Tooltip>

                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                                height: 26,
                                alignSelf: "center",
                                borderColor: "#e5e5e5",
                                mx: 0.5,
                            }}
                        />

                        {/* Wishlist */}

                        <Tooltip title="Wishlist" arrow>
                            <IconButton
                                component={RouterLink}
                                to={ACTION_PATHS.wishlist}
                                aria-label="Wishlist"
                                sx={{
                                    width: 42,
                                    height: 42,
                                    color: "#222",

                                    transition:
                                        "all 0.2s ease",

                                    "&:hover": {
                                        color: "#8B0000",
                                        bgcolor: "#faf3f3",
                                    },
                                }}
                            >
                                <Badge
                                    badgeContent={wishlistCount}
                                    sx={{
                                        "& .MuiBadge-badge": {
                                            minWidth: 17,
                                            height: 17,
                                            px: 0.4,

                                            bgcolor: "#8B0000",
                                            color: "#fff",

                                            fontSize: "0.62rem",
                                            fontWeight: 700,

                                            border: "2px solid #fff",

                                            top: 1,
                                            right: -2,
                                        },
                                    }}
                                >
                                    <FavoriteBorderIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        {/* Cart */}

                        <Tooltip title="Shopping Cart" arrow>
                            <IconButton
                                component={RouterLink}
                                to={ACTION_PATHS.cart}
                                aria-label="Shopping Cart"
                                sx={{
                                    width: 42,
                                    height: 42,
                                    color: "#222",

                                    transition:
                                        "all 0.2s ease",

                                    "&:hover": {
                                        color: "#8B0000",
                                        bgcolor: "#faf3f3",
                                    },
                                }}
                            >
                                <Badge
                                    badgeContent={cartCount}
                                    sx={{
                                        "& .MuiBadge-badge": {
                                            minWidth: 17,
                                            height: 17,
                                            px: 0.4,

                                            bgcolor: "#8B0000",
                                            color: "#fff",

                                            fontSize: "0.62rem",
                                            fontWeight: 700,

                                            border: "2px solid #fff",

                                            top: 1,
                                            right: -2,
                                        },
                                    }}
                                >
                                    <ShoppingBagOutlinedIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* ================= MOBILE MENU ================= */}

                    <IconButton
                        aria-label="Open menu"
                        onClick={() => setMobileOpen(true)}
                        sx={{
                            display: {
                                xs: "flex",
                                sm: "none",
                            },

                            width: 44,
                            height: 44,

                            color: "#222",

                            "&:hover": {
                                bgcolor: "#faf3f3",
                                color: "#8B0000",
                            },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* ================= MOBILE DRAWER ================= */}

            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                PaperProps={{
                    sx: {
                        width: {
                            xs: "82%",
                            sm: 360,
                        },

                        bgcolor: "#fff",
                    },
                }}
            >
                {/* Drawer Header */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 2.5,
                        py: 2,

                        borderBottom: "1px solid #eeeeee",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "1.05rem",
                            fontWeight: 700,
                            letterSpacing: "0.03em",
                        }}
                    >
                        MENU
                    </Typography>

                    <IconButton
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close menu"
                        sx={{
                            color: "#222",

                            "&:hover": {
                                color: "#8B0000",
                                bgcolor: "#faf3f3",
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Navigation */}

                <List sx={{ px: 1.5, py: 2 }}>
                    {NAV_LINKS.map(({ label, path }) => {
                        const isActive = isActivePath(path);

                        return (
                            <ListItem
                                key={label}
                                disablePadding
                                sx={{ mb: 0.5 }}
                            >
                                <ListItemButton
                                    component={RouterLink}
                                    to={path}
                                    onClick={() => setMobileOpen(false)}
                                    sx={{
                                        borderRadius: 1.5,
                                        px: 2,

                                        color: isActive
                                            ? "#8B0000"
                                            : "#222",

                                        bgcolor: isActive
                                            ? "#faf3f3"
                                            : "transparent",

                                        "&:hover": {
                                            bgcolor: "#faf3f3",
                                            color: "#8B0000",
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={label}
                                        primaryTypographyProps={{
                                            fontSize: "0.95rem",
                                            fontWeight: isActive
                                                ? 700
                                                : 600,
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                <Divider sx={{ mx: 2 }} />

                {/* Mobile Actions */}

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        px: 2.5,
                        py: 3,
                    }}
                >
                    <Button
                        component={RouterLink}
                        to={ACTION_PATHS.search}
                        onClick={() => setMobileOpen(false)}
                        startIcon={<SearchIcon />}
                        fullWidth
                        sx={{
                            justifyContent: "flex-start",
                            color: "#222",
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 1.5,
                            px: 2,
                            py: 1.2,

                            "&:hover": {
                                bgcolor: "#faf3f3",
                                color: "#8B0000",
                            },
                        }}
                    >
                        Search
                    </Button>

                    <Button
                        component={RouterLink}
                        to={ACTION_PATHS.account}
                        onClick={() => setMobileOpen(false)}
                        startIcon={<PersonOutlineIcon />}
                        fullWidth
                        sx={{
                            justifyContent: "flex-start",
                            color: "#222",
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 1.5,
                            px: 2,
                            py: 1.2,

                            "&:hover": {
                                bgcolor: "#faf3f3",
                                color: "#8B0000",
                            },
                        }}
                    >
                        My Account
                    </Button>

                    <Button
                        component={RouterLink}
                        to={ACTION_PATHS.wishlist}
                        onClick={() => setMobileOpen(false)}
                        startIcon={<FavoriteBorderIcon />}
                        fullWidth
                        sx={{
                            justifyContent: "flex-start",
                            color: "#222",
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 1.5,
                            px: 2,
                            py: 1.2,

                            "&:hover": {
                                bgcolor: "#faf3f3",
                                color: "#8B0000",
                            },
                        }}
                    >
                        Wishlist ({wishlistCount})
                    </Button>

                    <Button
                        component={RouterLink}
                        to={ACTION_PATHS.cart}
                        onClick={() => setMobileOpen(false)}
                        startIcon={<ShoppingBagOutlinedIcon />}
                        fullWidth
                        sx={{
                            justifyContent: "flex-start",
                            color: "#222",
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 1.5,
                            px: 2,
                            py: 1.2,

                            "&:hover": {
                                bgcolor: "#faf3f3",
                                color: "#8B0000",
                            },
                        }}
                    >
                        Shopping Cart ({cartCount})
                    </Button>
                </Box>
            </Drawer>
        </>
    );
}
