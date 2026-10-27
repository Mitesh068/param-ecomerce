import { useCallback, useEffect, useState } from "react";
import { ArrowBackRounded, CalendarMonthOutlined, ImageOutlined, PersonOutlineRounded } from "@mui/icons-material";
import { Alert, Box, Button, Chip, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { blogDetails } from "../../Api/services/Services";

function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

// Normalizes the API response shape: { blog }, { data: { blog } }, { data: {...blog} } or the blog itself
function extractBlog(response) {
    const payload = response?.data ?? response;
    return payload?.blog ?? payload?.data ?? (payload?.id || payload?.title ? payload : null);
}

export default function BlogDetails() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadBlog = useCallback(async (isCancelled = () => false) => {
        if (!id) {
            setError("Invalid blog id.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await blogDetails(id);
            if (isCancelled()) return;
            setBlog(extractBlog(response));
        } catch (err) {
            if (isCancelled()) return;
            setBlog(null);
            setError(err?.response?.data?.message || err?.message || "Unable to load this blog.");
        } finally {
            if (!isCancelled()) setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        let cancelled = false;
        loadBlog(() => cancelled);
        return () => { cancelled = true; };
    }, [loadBlog]);

    const image = blog?.image ?? blog?.image_url ?? blog?.imageUrl;

    return <Box sx={{ minHeight: "100vh", bgcolor: "#fff", pb: 8 }}>
        <Container maxWidth="md" sx={{ pt: { xs: 4, md: 6 } }}>
            <Button component={RouterLink} to="/blogs" startIcon={<ArrowBackRounded />} sx={{ px: 0, mb: 2.1, color: "#5e5e5e", fontSize: 13, fontWeight: 700, "&:hover": { bgcolor: "transparent", color: "#8b0000" } }}>Back to articles</Button>

            {loading && <Stack alignItems="center" sx={{ py: 8 }}><CircularProgress size={32} sx={{ color: "#8b0000" }} /></Stack>}

            {!loading && error && <Alert severity="error" sx={{ mb: 3 }} action={<Button color="inherit" size="small" onClick={() => loadBlog()}>Retry</Button>}>{error}</Alert>}

            {!loading && !error && !blog && <Typography color="text.secondary">Blog not found.</Typography>}

            {!loading && blog && <>
                <Typography sx={{ mb: 1.1, color: "#7b7775", fontSize: 12, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>The GearUp Journal</Typography>
                {blog.status && <Chip label={blog.status} size="small" sx={{ bgcolor: "#fbefef", color: "#8b0000", fontSize: 12, fontWeight: 700 }} />}
                <Typography component="h1" sx={{ mt: 1.5, maxWidth: 850, color: "#1d1d1d", fontSize: { xs: 32, sm: 42, md: 52 }, fontWeight: 700, lineHeight: 1.12, letterSpacing: "-.035em" }}>{blog.title}</Typography>
                <Stack direction="row" spacing={{ xs: 1.2, sm: 2 }} flexWrap="wrap" useFlexGap sx={{ mt: 2.2, color: "#747474", fontSize: 14 }}>
                    {blog.author && <Stack direction="row" spacing={0.6} alignItems="center"><PersonOutlineRounded sx={{ fontSize: 18 }} /><span>By {blog.author}</span></Stack>}
                    {formatDate(blog.created_at) && <Stack direction="row" spacing={0.6} alignItems="center"><CalendarMonthOutlined sx={{ fontSize: 18 }} /><span>{formatDate(blog.created_at)}</span></Stack>}
                </Stack>
                <Box sx={{ mt: { xs: 4, md: 5 }, width: "100%", height: { xs: 260, sm: 380, md: 490 }, overflow: "hidden", borderRadius: 3, bgcolor: "#f2f0ee", boxShadow: "0 16px 34px rgba(30,20,16,.08)" }}>
                    {image ? <Box component="img" src={image} alt={blog.title || "Blog"} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Stack role="img" aria-label="No image available" alignItems="center" justifyContent="center" sx={{ width: "100%", height: "100%", color: "#999" }}><ImageOutlined sx={{ fontSize: 56 }} /><Typography sx={{ fontSize: 13 }}>No image available</Typography></Stack>}
                </Box>
                <Box component="article" sx={{ mt: { xs: 4, md: 6 }, maxWidth: 760, mx: "auto" }}>
                    {blog.status && <Typography sx={{ mb: 2, color: "#8b0000", fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>Status: {blog.status}</Typography>}
                    <Typography component="p" sx={{ m: 0, color: "#373737", fontSize: { xs: 17, md: 19 }, lineHeight: 1.9, whiteSpace: "pre-line" }}>{blog.content || "No content available."}</Typography>
                    {blog.updated_at && <Typography sx={{ mt: 3, color: "#888", fontSize: 13 }}>Updated {formatDate(blog.updated_at)}</Typography>}
                </Box>
            </>}
        </Container>
    </Box>;
}