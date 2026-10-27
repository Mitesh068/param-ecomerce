import { useEffect, useState } from "react";
import { ArrowForwardRounded, CalendarMonthOutlined, ImageOutlined, PersonOutlineRounded } from "@mui/icons-material";
import { Alert, Box, Button, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { blogList } from "../../Api/services/Services";

function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function ArticleCard({ post }) {
    const image = post.image ?? post.image_url ?? post.imageUrl;
    return <Card elevation={0} sx={{ height: "100%", border: "1px solid #e7e4e2", borderRadius: 2.5, overflow: "hidden", bgcolor: "#fff", transition: "transform .25s ease, box-shadow .25s ease", "&:hover": { transform: "translateY(-5px)", boxShadow: "0 18px 36px rgba(47,30,24,.10)" } }}>
        {image ? <Box component="img" src={image} alt={post.title || "Blog"} sx={{ display: "block", width: "100%", height: 205, objectFit: "cover" }} /> : <Box role="img" aria-label="No image available" sx={{ height: 205, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0.5, bgcolor: "#f2f0ee", color: "#999" }}><ImageOutlined sx={{ fontSize: 42 }} /><Typography sx={{ fontSize: 12 }}>No image available</Typography></Box>}
        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.4 } }}>
            {post.status && <Typography sx={{ color: "#8b0000", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>{post.status}</Typography>}
            <Typography component="h2" sx={{ mt: 0.7, minHeight: 52, fontSize: 19, fontWeight: 700, lineHeight: 1.35, color: "#202020" }}>{post.title || "Untitled blog"}</Typography>
            <Typography sx={{ mt: 0.8, color: "#686868", fontSize: 14, lineHeight: 1.62, whiteSpace: "pre-line" }}>{post.content || "No content available."}</Typography>
            <Stack direction="row" spacing={1.35} flexWrap="wrap" useFlexGap sx={{ mt: 1.8, color: "#747474", fontSize: 12.5 }}>
                {formatDate(post.created_at) && <Stack direction="row" spacing={0.45} alignItems="center"><CalendarMonthOutlined sx={{ fontSize: 15 }} /><span>{formatDate(post.created_at)}</span></Stack>}
                {post.author && <Stack direction="row" spacing={0.45} alignItems="center"><PersonOutlineRounded sx={{ fontSize: 15 }} /><span>{post.author}</span></Stack>}
            </Stack>
            <Button component={RouterLink} to={`/blog-details/${post.id}`} endIcon={<ArrowForwardRounded sx={{ fontSize: 17 }} />} sx={{ mt: 1.2, px: 0, minHeight: 30, color: "#8b0000", fontSize: 13, fontWeight: 700, "&:hover": { bgcolor: "transparent", color: "#5e0000" } }}>Read article</Button>
        </CardContent>
    </Card>;
}

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        blogList()
            .then((response) => {
                if (active) setBlogs(Array.isArray(response?.blogs) ? response.blogs : []);
            })
            .catch((requestError) => {
                if (active) setError(requestError.response?.data?.message || "Unable to load blogs. Please try again later.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => { active = false; };
    }, []);

    return <Box sx={{ minHeight: "100vh", bgcolor: "#fcfbfa", pb: { xs: 6, md: 9 } }}>
        <Box sx={{ bgcolor: "#1d1c1b", color: "#fff", py: { xs: 6, md: 8 }, position: "relative", overflow: "hidden" }}>
            <Box sx={{ position: "absolute", width: 440, height: 440, borderRadius: "50%", bgcolor: "rgba(139,0,0,.22)", right: "-130px", top: "-250px" }} />
            <Container maxWidth="lg" sx={{ position: "relative" }}>
                <Typography sx={{ color: "#e6a79f", fontSize: 12, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" }}>GearUp Journal</Typography>
                <Typography component="h1" sx={{ mt: 1.2, maxWidth: 680, fontSize: { xs: 34, md: 50 }, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-.04em" }}>Ride further. Know more.</Typography>
                <Typography sx={{ maxWidth: 540, mt: 1.7, color: "#d2cecb", fontSize: 16, lineHeight: 1.7 }}>Thoughtful guides, useful gear advice, and stories from the people who live for the open road.</Typography>
            </Container>
        </Box>
        <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 6 } }}>
            <Typography sx={{ fontSize: 25, fontWeight: 700, color: "#202020", mb: 3 }}>Latest stories</Typography>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {loading ? <Typography color="text.secondary">Loading blogs…</Typography> : blogs.length === 0 ? <Typography color="text.secondary">No blogs available yet.</Typography> : <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2.5 }}>{blogs.map((post) => <ArticleCard key={post.id} post={post} />)}</Box>}
        </Container>
    </Box>;
}
