import React, { useState } from "react";
import { AccessTimeOutlined, EmailOutlined, PhoneOutlined, PlaceOutlined, SendRounded } from "@mui/icons-material";
import { Alert, Box, Button, Container, Divider, Snackbar, Stack, TextField, Typography } from "@mui/material";

const emptyForm = { name: "", email: "", phone: "", message: "" };

function getErrors(values) {
    const errors = {};
    if (!values.name.trim()) errors.name = "Please enter your name.";
    if (!values.email.trim()) errors.email = "Please enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Enter a valid email address.";
    if (!values.message.trim()) errors.message = "Please tell us how we can help.";
    return errors;
}

function ContactItem({ icon, title, children }) {
    return <Stack direction="row" spacing={1.5} alignItems="flex-start"><Box sx={{ display: "grid", placeItems: "center", width: 38, height: 38, flexShrink: 0, borderRadius: 1.5, bgcolor: "#fbeeee", color: "#8b0000" }}>{icon}</Box><Box><Typography sx={{ fontSize: 13, fontWeight: 700, color: "#222" }}>{title}</Typography><Typography sx={{ mt: 0.2, fontSize: 14, color: "#6b6b6b", lineHeight: 1.5 }}>{children}</Typography></Box></Stack>;
}

export default function ContactUs() {
    const [values, setValues] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const updateValue = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));
    const submit = (event) => {
        event.preventDefault();
        const nextErrors = getErrors(values);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;
        setValues(emptyForm);
        setSubmitted(true);
    };
    const fieldStyle = { "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "#fff", "& fieldset": { borderColor: "#dedede" }, "&:hover fieldset": { borderColor: "#9d9d9d" }, "&.Mui-focused fieldset": { borderColor: "#8b0000", borderWidth: 1 } }, "& .MuiInputLabel-root.Mui-focused": { color: "#8b0000" } };

    return <Box sx={{ minHeight: "100vh", bgcolor: "#F7F7F7", py: { xs: 4, md: 7 } }}>
        <Container maxWidth="lg">
            <Box sx={{ maxWidth: 650, mx: "auto", textAlign: "center", mb: { xs: 4, md: 5 } }}><Typography sx={{ color: "#8b0000", fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>Contact GearUp</Typography><Typography component="h1" sx={{ mt: 1, color: "#202020", fontSize: { xs: 32, md: 42 }, fontWeight: 700, lineHeight: 1.15 }}>How can we help?</Typography><Typography sx={{ mt: 1.25, color: "#6b6b6b", fontSize: 16, lineHeight: 1.65 }}>Have a question about an order, product, or your next ride? Send us a message and our team will get back to you shortly.</Typography></Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "0.8fr 1.2fr" }, border: "1px solid #e6e2e0", borderRadius: 3, bgcolor: "#fff", overflow: "hidden", boxShadow: "0 16px 36px rgba(45,30,20,.06)" }}>
                <Box sx={{ p: { xs: 3, md: 4 }, bgcolor: "#f6f1ef" }}><Typography sx={{ fontSize: 20, fontWeight: 700, color: "#252525" }}>Get in touch</Typography><Typography sx={{ mt: 0.9, mb: 3.5, fontSize: 14, lineHeight: 1.65, color: "#6b6b6b" }}>Choose the contact option that works best for you.</Typography><Stack spacing={2.8}><ContactItem icon={<EmailOutlined fontSize="small" />} title="Email us">support@gearup.com</ContactItem><ContactItem icon={<PhoneOutlined fontSize="small" />} title="Call us">+91 79 4000 1234</ContactItem><ContactItem icon={<AccessTimeOutlined fontSize="small" />} title="Support hours">Monday to Saturday, 9:30 AM – 6:30 PM</ContactItem><ContactItem icon={<PlaceOutlined fontSize="small" />} title="Visit us">Ahmedabad, Gujarat, India</ContactItem></Stack><Divider sx={{ my: 3.5, borderColor: "#ded7d4" }} /><Typography sx={{ color: "#777", fontSize: 13, lineHeight: 1.6 }}>For order updates, please include your order number in your message.</Typography></Box>
                <Box sx={{ p: { xs: 3, md: 4.5 } }}><Typography sx={{ fontSize: 20, fontWeight: 700, color: "#252525" }}>Send a message</Typography><Typography sx={{ mt: 0.7, mb: 3, fontSize: 14, color: "#777" }}>We usually respond within one business day.</Typography><Box component="form" onSubmit={submit} noValidate><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}><TextField required label="Full name" value={values.name} onChange={updateValue("name")} error={Boolean(errors.name)} helperText={errors.name} sx={fieldStyle} /><TextField required type="email" label="Email address" value={values.email} onChange={updateValue("email")} error={Boolean(errors.email)} helperText={errors.email} sx={fieldStyle} /><TextField label="Phone number (optional)" value={values.phone} onChange={updateValue("phone")} sx={{ ...fieldStyle, gridColumn: { sm: "1 / -1" } }} /><TextField required multiline minRows={5} label="How can we help?" placeholder="Tell us about your question or request" value={values.message} onChange={updateValue("message")} error={Boolean(errors.message)} helperText={errors.message} sx={{ ...fieldStyle, gridColumn: { sm: "1 / -1" } }} /></Box><Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={1.5} sx={{ mt: 3 }}><Button type="submit" endIcon={<SendRounded />} variant="contained" disableElevation sx={{ bgcolor: "#8b0000", px: 2.5, py: 1.15, borderRadius: 1.5, fontSize: 14, fontWeight: 700, "&:hover": { bgcolor: "#680000" } }}>Send message</Button></Stack></Box></Box>
            </Box>
        </Container>
        <Snackbar open={submitted} autoHideDuration={5000} onClose={() => setSubmitted(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}><Alert severity="success" variant="filled" onClose={() => setSubmitted(false)} sx={{ borderRadius: 1.5 }}>Thanks! Your message has been sent. We’ll be in touch soon.</Alert></Snackbar>
    </Box>;
}
    