import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Paper, Typography, TextField, Button, InputAdornment,
  IconButton, Checkbox, FormControlLabel, Avatar, Divider,
  Alert, CircularProgress,
} from "@mui/material";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import { COLORS } from "../theme/theme";
import { Authentication } from "../Api/services/Services";


export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await Authentication({
        email: formData.email,
        password: formData.password,
      });

      // Adjust these keys to match your actual API response shape
      const token = response?.data?.token || response?.token;
      const user = response?.data?.user || response?.user;

      if (token) {
        localStorage.setItem("accessToken", token);
      }
      if (user) {
        localStorage.setItem("adminUser", JSON.stringify(user));
      }

      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please check your credentials and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${COLORS.sidebarBg} 0%, ${COLORS.primary} 100%)`,
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          display: "flex",
          width: 900,
          maxWidth: "100%",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        {/* Left branding panel */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            p: 5,
            background: `linear-gradient(160deg, ${COLORS.primary}, #7C3AED)`,
            color: "#fff",
          }}
        >
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.15)", width: 56, height: 56, borderRadius: "14px", mb: 3 }}>
            <StorefrontRoundedIcon />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5 }}>ShopSphere Admin</Typography>
          <Typography sx={{ opacity: 0.85, fontSize: "0.9rem", lineHeight: 1.7 }}>
            Manage your products, orders, promotions and customer engagement
            all from one clean, powerful dashboard.
          </Typography>
        </Box>

        {/* Right login form */}
        <Box sx={{ flex: 1, p: { xs: 3, md: 5 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Welcome back 👋</Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>Login to access your admin dashboard</Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email Address"
              type="email"
              name="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineRoundedIcon sx={{ fontSize: 19, color: COLORS.textMuted }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon sx={{ fontSize: 19, color: COLORS.textMuted }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword((s) => !s)}>
                      {showPassword ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <FormControlLabel
                control={<Checkbox size="small" defaultChecked />}
                label={<Typography sx={{ fontSize: "0.8rem" }}>Remember me</Typography>}
              />
              <Typography sx={{ fontSize: "0.8rem", color: COLORS.primary, cursor: "pointer", fontWeight: 600 }}>
                Forgot password?
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ borderRadius: "10px", py: 1.3, mt: 1 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In to Dashboard"}
            </Button>

            <Divider sx={{ my: 1, fontSize: "0.75rem", color: COLORS.textMuted }}>OR</Divider>

            <Button variant="outlined" fullWidth sx={{ borderRadius: "10px", py: 1.2, borderColor: COLORS.border, color: COLORS.textDark }}>
              Continue with Google
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}