import React from "react";
import {
    ArrowForwardRounded,
    CategoryOutlined,
    HandshakeOutlined,
    InventoryOutlined,
    LanguageOutlined,
    LocationOnOutlined,
    PublicOutlined,
    StorefrontOutlined,
    VerifiedOutlined,
    WorkspacePremiumOutlined,
} from "@mui/icons-material";
import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const RED = "#8b0000";
const DARK_RED = "#680000";
const TINT = "#f8f3f1";

const categories = [
    "Engine & engine components",
    "Transmission & clutch components",
    "Electrical & electronic parts",
    "Brake components",
    "Suspension parts",
    "Body & exterior parts",
    "Fuel system components",
    "Wheels & related components",
    "Scooter & motorcycle spare parts",
    "Other genuine and quality replacement parts",
];

const brands = ["TVS", "Honda", "Bajaj", "Hero", "Yamaha", "Suzuki"];

const customers = ["Dealers", "Distributors", "Wholesalers", "Retailers", "Workshops", "Resellers", "Service Businesses", "Importers"];

const whyUs = [
    { icon: <WorkspacePremiumOutlined />, title: "Genuine & Quality-Focused", text: "We understand the importance of authenticity and product quality in the automotive spare-parts industry." },
    { icon: <StorefrontOutlined />, title: "Wholesale Expertise", text: "Our business is built around serving B2B customers and understanding their commercial requirements." },
    { icon: <CategoryOutlined />, title: "Wide Product Categories", text: "We continuously expand our range to make sourcing easier for businesses." },
    { icon: <LocationOnOutlined />, title: "India-Based Sourcing", text: "Based in Delhi, we operate close to one of India's major automotive spare-parts markets." },
    { icon: <PublicOutlined />, title: "Export Ready", text: "We are building our international network to connect Indian spare-parts supply with businesses around the world." },
    { icon: <HandshakeOutlined />, title: "Long-Term Relationships", text: "We value trust, transparency and consistent service over short-term transactions." },
];

const international = [
    { title: "Product Sourcing", text: "We help buyers source products according to their requirements." },
    { title: "Bulk Supply", text: "We cater to wholesale and larger-volume requirements." },
    { title: "Competitive Pricing", text: "We work towards providing commercially competitive sourcing solutions." },
    { title: "Professional Communication", text: "We aim to maintain clear and consistent communication throughout the business process." },
    { title: "Long-Term Partnerships", text: "Our goal is to build lasting relationships rather than one-time transactions." },
];

const approach = [
    { title: "Source", text: "Identify and source the products our customers need." },
    { title: "Supply", text: "Provide reliable products at competitive wholesale prices." },
    { title: "Connect", text: "Build long-term relationships between Indian suppliers and businesses worldwide." },
];

const missionPoints = [
    "Expanding our product range",
    "Maintaining strong supplier relationships",
    "Serving B2B customers professionally",
    "Providing competitive wholesale solutions",
    "Developing international business",
    "Building long-term customer relationships",
    "Creating a trusted global brand through GearUpMoto",
];

const eyebrow = { color: RED, fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" };
const h2 = { color: "#252525", fontSize: { xs: 25, md: 30 }, fontWeight: 700, lineHeight: 1.25 };
const body = { color: "#6c6c6c", fontSize: 15, lineHeight: 1.75 };

const IconBox = ({ children }) => (
    <Box sx={{ display: "grid", placeItems: "center", width: 42, height: 42, borderRadius: 1.5, color: RED, bgcolor: "#fbeeee" }}>{children}</Box>
);

export default function About() {
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#fff", pb: { xs: 6, md: 9 } }}>
            {/* Hero */}
            <Box sx={{ bgcolor: TINT, borderBottom: "1px solid #eee5e2" }}>
                <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, alignItems: "center", gap: { xs: 4, md: 7 } }}>
                        <Box>
                            <Typography sx={eyebrow}>About Us</Typography>
                            <Typography component="h1" sx={{ mt: 1, color: "#202020", fontSize: { xs: 34, md: 47 }, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-.035em" }}>
                                Pal Enterprises
                            </Typography>
                            <Typography sx={{ mt: 0.8, color: RED, fontSize: 17, fontWeight: 600 }}>Powered by GearUpMoto</Typography>
                            <Typography sx={{ mt: 1.7, maxWidth: 520, color: "#64615f", fontSize: 16, lineHeight: 1.75 }}>
                                Connecting genuine two-wheeler spare parts with businesses across India and worldwide.
                            </Typography>
                            <Button
                                component={RouterLink}
                                to="/category"
                                endIcon={<ArrowForwardRounded />}
                                variant="contained"
                                disableElevation
                                sx={{ mt: 3, bgcolor: RED, px: 2.5, py: 1.1, borderRadius: 1.5, fontWeight: 700, "&:hover": { bgcolor: DARK_RED } }}
                            >
                                Explore products
                            </Button>
                        </Box>
                        <Box
                            component="img"
                            src="https://picsum.photos/seed/gearup-riders/900/650"
                            alt="Two-wheeler spare parts"
                            sx={{ width: "100%", height: { xs: 245, md: 350 }, objectFit: "cover", borderRadius: 3, boxShadow: "0 16px 30px rgba(46,28,20,.13)" }}
                        />
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 8 } }}>
                {/* Intro */}
                <Box sx={{ maxWidth: 760, mx: "auto", textAlign: "center" }}>
                    <Typography component="h2" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700, color: "#252525" }}>
                        Delhi-based. Wholesale-focused. Export-ready.
                    </Typography>
                    <Typography sx={{ mt: 1.25, color: "#696969", fontSize: 16, lineHeight: 1.7 }}>
                        Pal Enterprises is a Delhi-based automotive spare parts business specializing in the wholesale supply, distribution, sourcing and export of two-wheeler spare parts.
                    </Typography>
                    <Typography sx={{ mt: 1.5, color: "#696969", fontSize: 16, lineHeight: 1.7 }}>
                        Our customer-facing brand, GearUpMoto, represents our commitment to making genuine and quality two-wheeler spare parts easily accessible to dealers, distributors, retailers, workshops and automotive businesses.
                    </Typography>
                    <Typography sx={{ mt: 1.5, color: "#696969", fontSize: 16, lineHeight: 1.7 }}>
                        From our base in Karol Bagh, Delhi, one of India's well-known automotive markets, we serve customers across India while building long-term business relationships with buyers and partners in international markets.
                    </Typography>
                </Box>

                {/* Who we are */}
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 3.5, md: 7 }, alignItems: "center", mt: { xs: 6, md: 9 } }}>
                    <Box
                        component="img"
                        src="https://picsum.photos/seed/gearup-workshop/900/650"
                        alt="Spare parts warehouse"
                        sx={{ width: "100%", height: { xs: 235, md: 310 }, objectFit: "cover", borderRadius: 2.5 }}
                    />
                    <Box>
                        <Typography sx={{ ...eyebrow, letterSpacing: ".12em" }}>Who we are</Typography>
                        <Typography component="h2" sx={{ ...h2, mt: 1 }}>The right part, reliable quality, competitive pricing.</Typography>
                        <Typography sx={{ ...body, mt: 1.4 }}>
                            At Pal Enterprises, we understand the importance of having the right part, reliable quality and competitive pricing when running a two-wheeler spare parts business.
                        </Typography>
                        <Typography sx={{ ...body, mt: 1.2 }}>
                            The two-wheeler industry consists of thousands of components across motorcycles and scooters. Our goal is to simplify the sourcing process by bringing a wide range of spare parts together under one reliable business connection.
                        </Typography>
                        <Typography sx={{ ...body, mt: 1.2 }}>
                            Through GearUpMoto, we are building a professional platform where businesses can discover and source two-wheeler spare parts with greater convenience and confidence.
                        </Typography>
                    </Box>
                </Box>

                {/* What we do */}
                <Box sx={{ mt: { xs: 6, md: 9 }, p: { xs: 3, md: 4.5 }, borderRadius: 2.5, bgcolor: TINT }}>
                    <Typography sx={{ ...eyebrow, textAlign: "center" }}>What we do</Typography>
                    <Typography component="h2" sx={{ ...h2, mt: 1, textAlign: "center" }}>B2B wholesale supply and international sourcing</Typography>
                    <Typography sx={{ ...body, mt: 1.2, textAlign: "center", maxWidth: 640, mx: "auto" }}>
                        Our business focuses on B2B wholesale supply and international sourcing of two-wheeler spare parts. Our product categories include:
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" }, gap: 1.5, mt: 3 }}>
                        {categories.map((c) => (
                            <Stack key={c} direction="row" spacing={1.2} alignItems="center" sx={{ p: 1.6, bgcolor: "#fff", border: "1px solid #eee5e2", borderRadius: 2 }}>
                                <InventoryOutlined sx={{ color: RED, fontSize: 20 }} />
                                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#303030" }}>{c}</Typography>
                            </Stack>
                        ))}
                    </Box>
                    <Typography sx={{ ...body, mt: 2.5, textAlign: "center", fontSize: 14 }}>
                        We continuously work to expand our product range to meet the requirements of dealers, wholesalers, retailers and international buyers.
                    </Typography>
                </Box>

                {/* Brands */}
                <Box sx={{ mt: { xs: 6, md: 9 }, textAlign: "center" }}>
                    <Typography sx={eyebrow}>Our brands &amp; product range</Typography>
                    <Typography component="h2" sx={{ ...h2, mt: 1 }}>Spare parts for leading two-wheeler brands</Typography>
                    <Stack direction="row" flexWrap="wrap" justifyContent="center" useFlexGap spacing={1.2} sx={{ mt: 3 }}>
                        {brands.map((b) => (
                            <Chip key={b} label={b} sx={{ px: 1.2, py: 2.4, fontSize: 15, fontWeight: 700, color: "#252525", bgcolor: "#fff", border: "1px solid #e1d9d6", borderRadius: 2, marginLeft: 10 }} />
                        ))}
                    </Stack>
                    <Typography sx={{ ...body, mt: 2.5, maxWidth: 640, mx: "auto" }}>
                        Our focus is on supplying genuine and quality-focused products sourced through reliable channels. For businesses, our objective is to provide a convenient sourcing point for multiple two-wheeler spare-part requirements.
                    </Typography>
                </Box>

                {/* Wholesale */}
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 3, md: 7 }, alignItems: "center", mt: { xs: 6, md: 9 } }}>
                    <Box>
                        <Typography sx={{ ...eyebrow, letterSpacing: ".12em" }}>Wholesale business</Typography>
                        <Typography component="h2" sx={{ ...h2, mt: 1 }}>Built for dealers. Designed for businesses.</Typography>
                        <Typography sx={{ ...body, mt: 1.4 }}>
                            Wholesale is at the heart of our business. Whether you require fast-moving spare parts, specific components or bulk quantities, our team works to understand your requirements and provide suitable sourcing solutions.
                        </Typography>
                        <Typography sx={{ ...body, mt: 1.2 }}>
                            We believe that successful wholesale business is built on competitive pricing, product reliability, communication and consistency.
                        </Typography>
                    </Box><br/>
                    <Box sx={{ p: 3, border: "1px solid #e9e5e3", borderRadius: 2.5 }}>
                        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#252525" }}>We work with</Typography>
                        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1} sx={{ mt: 1.8 }}>
                            {customers.map((c) => (
                                <Chip key={c} label={c} sx={{ color: RED, bgcolor: "#fbeeee", fontWeight: 600 }} />
                            ))}
                        </Stack>
                    </Box>
                </Box>

                {/* Export */}
                <Box sx={{ mt: { xs: 6, md: 9 }, p: { xs: 3, md: 4.5 }, borderRadius: 2.5, bgcolor: "#202020", color: "#fff" }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <LanguageOutlined sx={{ color: "#f2c9c9" }} />
                        <Typography sx={{ ...eyebrow, color: "#f2c9c9" }}>Export &amp; international business</Typography>
                    </Stack>
                    <Typography component="h2" sx={{ mt: 1, fontSize: { xs: 25, md: 30 }, fontWeight: 700 }}>From India to the world</Typography>
                    <Typography sx={{ mt: 1.4, color: "#d4d0ce", fontSize: 15, lineHeight: 1.75, maxWidth: 760 }}>
                        Pal Enterprises is also focused on developing its international business through the export and supply of two-wheeler spare parts. India has a large and diverse two-wheeler spare parts ecosystem, and our objective is to connect this supply network with international buyers.
                    </Typography>
                    <Typography sx={{ mt: 1.2, color: "#d4d0ce", fontSize: 15, lineHeight: 1.75, maxWidth: 760 }}>
                        We work with importers, distributors, wholesalers and dealers looking to source two-wheeler spare parts from India.
                    </Typography>
                    <Typography sx={{ mt: 3, fontSize: 17, fontWeight: 700 }}>Our international business focus</Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" }, gap: 2, mt: 2 }}>
                        {international.map((i) => (
                            <Box key={i.title} sx={{ p: 2.2, borderRadius: 2, bgcolor: "rgba(255,255,255,.07)" }}>
                                <Typography sx={{ fontSize: 15, fontWeight: 700 }}>{i.title}</Typography>
                                <Typography sx={{ mt: 0.6, color: "#d4d0ce", fontSize: 13.5, lineHeight: 1.6 }}>{i.text}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Why GearUpMoto */}
                <Box sx={{ mt: { xs: 6, md: 9 } }}>
                    <Typography component="h2" sx={{ ...h2, textAlign: "center" }}>Why GearUpMoto?</Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2.3, mt: { xs: 3, md: 4 } }}>
                        {whyUs.map((v) => (
                            <Box key={v.title} sx={{ p: 2.8, border: "1px solid #e9e5e3", borderRadius: 2.5, bgcolor: "#fff" }}>
                                <IconBox>{v.icon}</IconBox>
                                <Typography component="h3" sx={{ mt: 2, color: "#252525", fontSize: 18, fontWeight: 700 }}>{v.title}</Typography>
                                <Typography sx={{ mt: 0.7, color: "#707070", fontSize: 14, lineHeight: 1.65 }}>{v.text}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Approach */}
                <Box sx={{ mt: { xs: 6, md: 8 }, p: { xs: 3, md: 4 }, borderRadius: 2.5, bgcolor: TINT }}>
                    <Typography sx={{ ...eyebrow, textAlign: "center" }}>Our approach</Typography>
                    <Typography component="h2" sx={{ textAlign: "center", color: "#252525", fontSize: 25, fontWeight: 700, mt: 0.8 }}>Source. Supply. Connect.</Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2.5, mt: 3, textAlign: "center" }}>
                        {approach.map((a, idx) => (
                            <Box key={a.title}>
                                <Typography sx={{ color: RED, fontSize: 28, fontWeight: 700 }}>{String(idx + 1).padStart(2, "0")}</Typography>
                                <Typography sx={{ mt: 0.5, fontSize: 15, fontWeight: 700 }}>{a.title}</Typography>
                                <Typography sx={{ mt: 0.5, color: "#6c6c6c", fontSize: 13.5, lineHeight: 1.6 }}>{a.text}</Typography>
                            </Box>
                        ))}
                    </Box>
                    <Typography sx={{ mt: 3, textAlign: "center", color: "#6c6c6c", fontSize: 14 }}>
                        We believe every successful order is an opportunity to build a stronger business relationship.
                    </Typography>
                </Box>

                {/* Vision & Mission */}
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 3, md: 4 }, mt: { xs: 6, md: 8 } }}>
                    <Box sx={{ p: { xs: 3, md: 4 }, border: "1px solid #e9e5e3", borderRadius: 2.5 }}>
                        <Typography sx={eyebrow}>Our vision</Typography>
                        <Typography component="h2" sx={{ ...h2, mt: 1, fontSize: { xs: 22, md: 26 } }}>Building a global two-wheeler spare parts network</Typography>
                        <Typography sx={{ ...body, mt: 1.4 }}>
                            Our vision is to establish Pal Enterprises and GearUpMoto as a trusted name in the global two-wheeler spare parts industry.
                        </Typography>
                        <Typography sx={{ ...body, mt: 1.2 }}>
                            We aim to continuously expand our product range, strengthen our sourcing network, improve our digital presence and connect with more dealers, distributors, wholesalers and importers across international markets.
                        </Typography>
                        <Typography sx={{ ...body, mt: 1.2 }}>From Delhi, India, our ambition is to build a business that reaches far beyond borders.</Typography>
                    </Box>
                    <Box sx={{ p: { xs: 3, md: 4 }, border: "1px solid #e9e5e3", borderRadius: 2.5 }}>
                        <Typography sx={eyebrow}>Our mission</Typography>
                        <Typography component="h2" sx={{ ...h2, mt: 1, fontSize: { xs: 22, md: 26 } }}>Simpler, more reliable, more accessible sourcing</Typography>
                        <Typography sx={{ ...body, mt: 1.4 }}>
                            Our mission is to make two-wheeler spare-parts sourcing simpler, more reliable and more accessible for businesses. We are committed to:
                        </Typography>
                        <Stack spacing={1} sx={{ mt: 1.6 }}>
                            {missionPoints.map((m) => (
                                <Stack key={m} direction="row" spacing={1.2} alignItems="flex-start">
                                    <VerifiedOutlined sx={{ color: RED, fontSize: 20, mt: "2px" }} />
                                    <Typography sx={{ color: "#555", fontSize: 14.5, lineHeight: 1.6 }}>{m}</Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Box>
                </Box>

                {/* CTA */}
                <Box sx={{ mt: { xs: 5, md: 7 }, px: { xs: 2.5, md: 4 }, py: 4, borderRadius: 2.5, bgcolor: "#202020", color: "#fff" }}>
                    <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} justifyContent="space-between" spacing={3}>
                        <Box sx={{ maxWidth: 640 }}>
                            <Typography sx={{ fontSize: 22, fontWeight: 700 }}>For dealers, wholesalers &amp; importers</Typography>
                            <Typography sx={{ mt: 0.8, color: "#d4d0ce", fontSize: 14.5, lineHeight: 1.7 }}>
                                Looking for a reliable source of two-wheeler spare parts from India? Whether you are a dealer, distributor, wholesaler, retailer, workshop or international importer, we would be happy to discuss your requirements. Send us your product list, part numbers or requirements, and our team can work with you on suitable sourcing and supply options.
                            </Typography>
                        </Box>
                        <Button
                            component={RouterLink}
                            to="/contact"
                            variant="contained"
                            disableElevation
                            sx={{ flexShrink: 0, bgcolor: "#fff", color: "#202020", px: 2.6, py: 1.1, fontWeight: 700, "&:hover": { bgcolor: "#f1e7e4" } }}
                        >
                            Talk to us
                        </Button>
                    </Stack>

                    <Box sx={{ mt: 3.5, pt: 3, borderTop: "1px solid rgba(255,255,255,.14)" }}>
                        <Typography sx={{ fontSize: 15, fontWeight: 700 }}>Pal Enterprises</Typography>
                        <Typography sx={{ color: "#d4d0ce", fontSize: 13.5 }}>Brand: GearUpMoto</Typography>
                        <Stack direction={{ xs: "column", sm: "row" }} flexWrap="wrap" useFlexGap spacing={{ xs: 0.6, sm: 3 }} sx={{ mt: 1.5, color: "#d4d0ce", fontSize: 13.5 }}>
                            <Typography sx={{ fontSize: 13.5 }}>📍 Karol Bagh, Delhi, India</Typography>
                            <Typography sx={{ fontSize: 13.5 }}>🏍️ Two-Wheeler Spare Parts</Typography>
                            <Typography sx={{ fontSize: 13.5 }}>📦 Wholesale &amp; Bulk Supply</Typography>
                            <Typography sx={{ fontSize: 13.5 }}>🌎 Export &amp; International Business</Typography>
                            <Typography sx={{ fontSize: 13.5 }}>🤝 B2B Partnerships</Typography>
                        </Stack>
                        <Typography sx={{ mt: 2, color: "#f2c9c9", fontSize: 14, fontWeight: 600 }}>
                            From India to the world — supplying the two-wheeler spare parts industry.
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}