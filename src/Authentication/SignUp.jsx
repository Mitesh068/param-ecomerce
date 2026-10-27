import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { AccountCircleOutlined, EmailOutlined, LockOutlined, PhoneOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Box, Button, Checkbox, Container, FormControlLabel, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { signup as signupRequest } from "../Api/services/Services";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      await signupRequest(form);
      setMessage({ severity: "success", text: "Your account has been created successfully." });
      navigate("/");
    } catch (error) {
      setMessage({ severity: "error", text: error.response?.data?.message || error.message || "Unable to create your account. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return <Box sx={{ minHeight: "calc(100vh - 86px)", display: "flex", alignItems: "center", py: { xs: 4, md: 6 }, background: "linear-gradient(135deg, #F7F7F7 0%, #FFFFFF 45%, #C0C0C0 100%)" }}>
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, overflow: "hidden", bgcolor: "#fff", borderRadius: { xs: 3, md: 4 }, boxShadow: "0 18px 55px rgba(63, 22, 22, .14)" }}>
        <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", justifyContent: "space-between", minHeight: 640, p: 5, color: "#fff", background: "linear-gradient(145deg, #4a0505, #970909 60%, #bf3434)" }}>
          <Box><Typography sx={{ fontSize: 13, fontWeight: 800, letterSpacing: ".14em", opacity: 0.8 }}>GEARUP MOTO</Typography><Typography sx={{ mt: 3, maxWidth: 310, fontSize: 35, fontWeight: 800, lineHeight: 1.15 }}>Start your next adventure.</Typography><Typography sx={{ mt: 2, maxWidth: 285, color: "rgba(255,255,255,.76)", fontSize: 15, lineHeight: 1.7 }}>Create an account to save your favourite gear, track orders, and check out faster.</Typography></Box>
          <Box sx={{ borderTop: "1px solid rgba(255,255,255,.26)", pt: 2.5 }}><Typography sx={{ fontSize: 14, lineHeight: 1.6, opacity: 0.9 }}>Join a community built for life on the road.</Typography></Box>
        </Box>
        <Box sx={{ p: { xs: 3, sm: 5 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Box sx={{ display: { xs: "block", md: "none" }, color: "#8b0000", fontWeight: 850, fontSize: 13, letterSpacing: ".12em", mb: 3 }}>GEARUP MOTO</Box>
          <Typography component="h1" sx={{ color: "#222", fontSize: { xs: 29, sm: 32 }, fontWeight: 850 }}>Create your account</Typography>
          <Typography sx={{ mt: 0.8, mb: 3.2, color: "#777", fontSize: 15 }}>A few details and you are ready to ride.</Typography>
          {message && <Alert severity={message.severity} sx={{ mb: 2.25, borderRadius: 1.5 }}>{message.text}</Alert>}
          <Box component="form" onSubmit={submit}>
            <Stack spacing={2}>
              <TextField required label="Full name" value={form.name} onChange={update("name")} autoComplete="name" fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><AccountCircleOutlined sx={{ color: "#777", fontSize: 20 }} /></InputAdornment> }} />
              <TextField required type="email" label="Email address" value={form.email} onChange={update("email")} autoComplete="email" fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlined sx={{ color: "#777", fontSize: 20 }} /></InputAdornment> }} />
              <TextField required type="tel" label="Phone number" value={form.phone} onChange={update("phone")} autoComplete="tel" fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlined sx={{ color: "#777", fontSize: 20 }} /></InputAdornment> }} />
              <TextField required type={showPassword ? "text" : "password"} label="Create password" value={form.password} onChange={update("password")} autoComplete="new-password" helperText="Use at least 8 characters." fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><LockOutlined sx={{ color: "#777", fontSize: 20 }} /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
            </Stack>
            <FormControlLabel required control={<Checkbox size="small" sx={{ color: "#8b0000", "&.Mui-checked": { color: "#8b0000" } }} />} label={<Typography sx={{ fontSize: 13.5, color: "#666" }}>I agree to the Terms of Service and Privacy Policy</Typography>} sx={{ alignItems: "flex-start", mt: 1.4, ml: -0.5 }} />
            <Button type="submit" fullWidth variant="contained" disableElevation disabled={loading} sx={{ mt: 1.6, minHeight: 50, borderRadius: 1.5, bgcolor: "#8b0000", fontWeight: 800, fontSize: 16, textTransform: "none", "&:hover": { bgcolor: "#680000" } }}>{loading ? "Creating account…" : "Create account"}</Button>
          </Box>
          <Typography sx={{ mt: 3, color: "#777", textAlign: "center", fontSize: 14 }}>Already have an account? <Box component={RouterLink} to="/login" sx={{ color: "#8b0000", fontWeight: 750, textDecoration: "none" }}>Sign in</Box></Typography>
        </Box>
      </Box>
    </Container>
  </Box>;
}
