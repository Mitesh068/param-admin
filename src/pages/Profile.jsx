import React, { useEffect, useState } from "react";
import {
  Grid, Card, Box, Typography, TextField, Button, Avatar, IconButton,
  Divider, Switch, CircularProgress, InputAdornment,
} from "@mui/material";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { COLORS } from "../theme/theme";
import { AdminDetails } from "../Api/services/Services";

/* ---------- Shared styles ---------- */

const cardSx = {
  borderRadius: "14px",
  border: `1px solid ${COLORS.border}`,
  boxShadow: "none",
  overflow: "hidden",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
  "& .MuiInputLabel-root": { fontSize: "0.9rem" },
};

/* ---------- Building blocks ---------- */

function FormCard({ title, subtitle, children, footer }) {
  return (
    <Card sx={cardSx}>
      <Box sx={{ px: 3, pt: 2.5, pb: 2 }}>
        <Typography sx={{ fontSize: "1rem", fontWeight: 700, lineHeight: 1.3 }}>{title}</Typography>
        {subtitle && (
          <Typography sx={{ fontSize: "0.8rem", color: COLORS.textMuted, mt: 0.25 }}>{subtitle}</Typography>
        )}
      </Box>
      <Divider sx={{ borderColor: COLORS.border }} />
      <Box sx={{ p: 3 }}>{children}</Box>
      {footer && (
        <>
          <Divider sx={{ borderColor: COLORS.border }} />
          <Box
            sx={{
              px: 3, py: 1.75, bgcolor: COLORS.bg,
              display: "flex", justifyContent: "flex-end", gap: 1.5,
            }}
          >
            {footer}
          </Box>
        </>
      )}
    </Card>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.75, py: 1.25 }}>
      <Avatar
        sx={{
          width: 34, height: 34, borderRadius: "10px",
          bgcolor: COLORS.primaryLight, color: COLORS.primary,
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 18 } })}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: "0.75rem", color: COLORS.textMuted, lineHeight: 1.3 }}>{label}</Typography>
        <Typography sx={{ fontSize: "0.88rem", fontWeight: 500, wordBreak: "break-word" }}>
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  );
}

function PreferenceRow({ title, description, checked, onChange }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, py: 1.25 }}>
      <Box>
        <Typography sx={{ fontSize: "0.88rem", fontWeight: 500 }}>{title}</Typography>
        <Typography sx={{ fontSize: "0.78rem", color: COLORS.textMuted }}>{description}</Typography>
      </Box>
      <Switch checked={checked} onChange={onChange} />
    </Box>
  );
}

function PasswordField({ label, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <TextField
      label={label}
      type={show ? "text" : "password"}
      fullWidth
      sx={fieldSx}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton size="small" edge="end" onClick={() => setShow((s) => !s)} aria-label="Toggle password visibility">
              {show ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}

/* ---------- Page ---------- */

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [profile, setProfile] = useState({
    fullName: "",
    displayName: "",
    email: "",
    phone: "",
    bio: "",
    role: "",
    organization: "",
    joinedDate: "",
    avatarInitials: "",
  });

  const [prefs, setPrefs] = useState({ email: true, orders: true, marketing: false });

  useEffect(() => {
    let isMounted = true;

    const fetchAdminDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await AdminDetails();
        // API response shape: { success, message, admin: { id, name, email, role, is_active, created_at } }
        const data = response?.data?.admin || response?.admin || {};

        if (!isMounted) return;

        setProfile({
          fullName: data.name || "",
          displayName: data.name || "",
          email: data.email || "",
          phone: "",
          bio: "",
          role: data.role || "",
          organization: "",
          joinedDate: data.created_at
            ? new Date(data.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
            : "",
          avatarInitials: (data.name || "")
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
        });
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAdminDetails();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const handleFieldChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePref = (key) => (e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }));

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card sx={{ ...cardSx, py: 6, px: 3, textAlign: "center", maxWidth: 480, mx: "auto" }}>
        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Couldn't load your profile</Typography>
        <Typography sx={{ fontSize: "0.88rem", color: COLORS.textMuted, mb: 2.5 }}>
          Something went wrong while fetching your details. Check your connection and try again.
        </Typography>
        <Button variant="contained" onClick={() => setReloadKey((k) => k + 1)} sx={{ textTransform: "none", borderRadius: "10px" }}>
          Try again
        </Button>
      </Card>
    );
  }

  const cancelSx = { textTransform: "none", fontWeight: 600, borderRadius: "10px", borderColor: COLORS.border, color: COLORS.textDark };
  const saveSx = { textTransform: "none", fontWeight: 600, borderRadius: "10px", boxShadow: "none" };

  return (
    <Box sx={{ width: "100%", maxWidth: 1400, mx: "auto" }}>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>Profile</Typography>
        <Typography sx={{ fontSize: "0.88rem", color: COLORS.textMuted, mt: 0.25 }}>
          Manage your personal details, password and notification settings
        </Typography>
      </Box>

      <Grid container spacing={3} alignItems="flex-start">
        {/* Left column */}
        <Grid item xs={12} md={4} sx={{ minWidth: 0 }}>
          <Card sx={cardSx}>
            {/* Cover */}
            <Box
              sx={{
                height: 96,
                background: `linear-gradient(120deg, ${COLORS.primary}, ${COLORS.primaryDark || COLORS.primary})`,
              }}
            />
            <Box sx={{ px: 3, pb: 3, textAlign: "center" }}>
              <Box sx={{ position: "relative", display: "inline-block", mt: "-48px", mb: 1.5 }}>
                <Avatar
                  sx={{
                    width: 96, height: 96, bgcolor: COLORS.primary, fontSize: "1.9rem", fontWeight: 600,
                    border: "4px solid #fff",
                  }}
                >
                  {profile.avatarInitials || "?"}
                </Avatar>
                <IconButton
                  size="small"
                  aria-label="Change photo"
                  sx={{
                    position: "absolute", bottom: 2, right: 2, bgcolor: "#fff", color: COLORS.primary,
                    border: `1px solid ${COLORS.border}`, "&:hover": { bgcolor: COLORS.primaryLight },
                  }}
                >
                  <CameraAltRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>

              <Typography sx={{ fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.3 }}>
                {profile.fullName || "Admin"}
              </Typography>
              {profile.role && (
                <Box
                  sx={{
                    display: "inline-block", mt: 0.75, px: 1.25, py: 0.25, borderRadius: "999px",
                    bgcolor: COLORS.primaryLight, color: COLORS.primary,
                    fontSize: "0.75rem", fontWeight: 600, textTransform: "capitalize",
                  }}
                >
                  {profile.role}
                </Box>
              )}

              <Divider sx={{ my: 2.5, borderColor: COLORS.border }} />

              <Box sx={{ textAlign: "left" }}>
                <InfoRow icon={<MailOutlineRoundedIcon />} label="Email" value={profile.email} />
                <InfoRow icon={<PhoneOutlinedIcon />} label="Phone" value={profile.phone} />
                <InfoRow icon={<BusinessRoundedIcon />} label="Organization" value={profile.organization} />
                <InfoRow icon={<CalendarTodayRoundedIcon />} label="Member since" value={profile.joinedDate} />
              </Box>
            </Box>
          </Card>

          <Card sx={{ ...cardSx, mt: 3 }}>
            <Box sx={{ px: 3, pt: 2.5, pb: 1.5 }}>
              <Typography sx={{ fontSize: "1rem", fontWeight: 700 }}>Notifications</Typography>
              <Typography sx={{ fontSize: "0.8rem", color: COLORS.textMuted, mt: 0.25 }}>
                Choose what you hear about
              </Typography>
            </Box>
            <Box sx={{ px: 3, pb: 1.5 }}>
              <PreferenceRow
                title="Email notifications"
                description="Account activity and updates"
                checked={prefs.email}
                onChange={handlePref("email")}
              />
              <Divider sx={{ borderColor: COLORS.border }} />
              <PreferenceRow
                title="Order alerts"
                description="New and cancelled orders"
                checked={prefs.orders}
                onChange={handlePref("orders")}
              />
              <Divider sx={{ borderColor: COLORS.border }} />
              <PreferenceRow
                title="Marketing emails"
                description="Product news and offers"
                checked={prefs.marketing}
                onChange={handlePref("marketing")}
              />
            </Box>
          </Card>
        </Grid>

        {/* Right column */}
        <Grid item xs={12} md={8} sx={{ minWidth: 0 }}>
          <FormCard
            title="Personal Information"
            subtitle="Update your name, contact details and bio"
            footer={
              <>
                <Button variant="outlined" sx={cancelSx}>Cancel</Button>
                <Button variant="contained" sx={saveSx}>Save changes</Button>
              </>
            }
          >
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField label="Full name" fullWidth sx={fieldSx} value={profile.fullName} onChange={handleFieldChange("fullName")} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Display name" fullWidth sx={fieldSx} value={profile.displayName} onChange={handleFieldChange("displayName")} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Email address" fullWidth sx={fieldSx} value={profile.email} onChange={handleFieldChange("email")} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Phone number" fullWidth sx={fieldSx} value={profile.phone} onChange={handleFieldChange("phone")} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Bio"
                  fullWidth
                  multiline
                  rows={4}
                  sx={fieldSx}
                  placeholder="Write a short introduction"
                  value={profile.bio}
                  onChange={handleFieldChange("bio")}
                />
              </Grid>
            </Grid>
          </FormCard>

          <Box sx={{ mt: 3 }}>
            <FormCard
              title="Change Password"
              subtitle="Use a strong password you don't use anywhere else"
              footer={
                <>
                  <Button variant="outlined" sx={cancelSx}>Cancel</Button>
                  <Button variant="contained" sx={saveSx}>Update password</Button>
                </>
              }
            >
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <PasswordField label="Current password" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PasswordField label="New password" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PasswordField label="Confirm new password" />
                </Grid>
              </Grid>
            </FormCard>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}