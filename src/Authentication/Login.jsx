import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { EmailOutlined, LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Box, Button, Checkbox, Container, Divider, FormControlLabel, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { Login as loginRequest } from "../Api/services/Services";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const response = await loginRequest(form);
      const token = response?.token ?? response?.accessToken ?? response?.access_token ?? response?.data?.token ?? response?.data?.accessToken ?? response?.data?.access_token;
      if (!token) {
        throw new Error("Login succeeded, but the response did not include an authentication token.");
      }
      localStorage.setItem("access-token", token);
      setMessage({ severity: "success", text: "Login in successfully." });
      navigate("/");
    } catch (error) {
      setMessage({ severity: "error", text: error.response?.data?.message || error.message || "Unable to sign in. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return <Box sx={{ minHeight: "calc(100vh - 86px)", display: "flex", alignItems: "center", py: { xs: 4, md: 6 }, background: "linear-gradient(135deg, #F7F7F7 0%, #FFFFFF 45%, #C0C0C0 100%)" }}>
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, overflow: "hidden", bgcolor: "#fff", borderRadius: { xs: 3, md: 4 }, boxShadow: "0 18px 55px rgba(63, 22, 22, .14)" }}>
        <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", justifyContent: "space-between", minHeight: 580, p: 5, color: "#fff", background: "linear-gradient(145deg, #4a0505, #970909 60%, #bf3434)" }}>
          <Box><Typography sx={{ fontSize: 13, fontWeight: 800, letterSpacing: ".14em", opacity: 0.8 }}>GEARUP MOTO</Typography><Typography sx={{ mt: 3, maxWidth: 300, fontSize: 35, fontWeight: 800, lineHeight: 1.15 }}>Ready for the road ahead.</Typography><Typography sx={{ mt: 2, maxWidth: 285, color: "rgba(255,255,255,.76)", fontSize: 15, lineHeight: 1.7 }}>Sign in to keep track of your orders, saved items, and riding essentials.</Typography></Box>
          <Box sx={{ borderTop: "1px solid rgba(255,255,255,.26)", pt: 2.5 }}><Typography sx={{ fontSize: 14, lineHeight: 1.6, opacity: 0.9 }}>“The best journeys begin with the right gear.”</Typography></Box>
        </Box>
        <Box sx={{ p: { xs: 3, sm: 5 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Box sx={{ display: { xs: "block", md: "none" }, color: "#BC0507", fontWeight: 850, fontSize: 13, letterSpacing: ".12em", mb: 3 }}>GEARUP MOTO</Box>
          <Typography component="h1" sx={{ color: "#222", fontSize: { xs: 29, sm: 32 }, fontWeight: 850 }}>Welcome back</Typography>
          <Typography sx={{ mt: 0.8, mb: 3.2, color: "#777", fontSize: 15 }}>Sign in to continue shopping your favourites.</Typography>
          {message && <Alert severity={message.severity} sx={{ mb: 2.25, borderRadius: 1.5 }}>{message.text}</Alert>}
          <Box component="form" onSubmit={submit}>
            <Stack spacing={2}>
              <TextField required type="email" label="Email address" value={form.email} onChange={update("email")} autoComplete="email" fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlined sx={{ color: "#777", fontSize: 20 }} /></InputAdornment> }} />
              <TextField required type={showPassword ? "text" : "password"} label="Password" value={form.password} onChange={update("password")} autoComplete="current-password" fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><LockOutlined sx={{ color: "#777", fontSize: 20 }} /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mt: 1.25 }}><FormControlLabel control={<Checkbox size="small" sx={{ color: "#BC0507", "&.Mui-checked": { color: "#BC0507" } }} />} label={<Typography sx={{ fontSize: 13.5, color: "#666" }}>Remember me</Typography>} /><Button sx={{ color: "#BC0507", textTransform: "none", fontWeight: 700, fontSize: 13.5, whiteSpace: "nowrap" }}>Forgot password?</Button></Stack>
            <Button type="submit" fullWidth variant="contained" disableElevation disabled={loading} sx={{ mt: 2.25, minHeight: 50, borderRadius: 1.5, bgcolor: "#BC0507", fontWeight: 800, fontSize: 16, textTransform: "none", "&:hover": { bgcolor: "#8F0002" } }}>{loading ? "Signing in…" : "Sign in"}</Button>
          </Box>
          <Divider sx={{ my: 3 }}><Typography sx={{ px: 1, color: "#999", fontSize: 12 }}>OR</Typography></Divider>
          <Button variant="outlined" fullWidth sx={{ minHeight: 48, borderColor: "#d4d4d4", color: "#333", textTransform: "none", fontWeight: 700, "&:hover": { borderColor: "#aaa", bgcolor: "#fafafa" } }}>Continue with Google</Button>
          <Typography sx={{ mt: 3, color: "#777", textAlign: "center", fontSize: 14 }}>New to GearUp Moto? <Box component={RouterLink} to="/signup" sx={{ color: "#BC0507", fontWeight: 750, textDecoration: "none" }}>Create an account</Box></Typography>
        </Box>
      </Box>
    </Container>
  </Box>;
}
