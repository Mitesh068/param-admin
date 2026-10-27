import React, { useState } from "react";
import {
  Grid, Card, Box, Typography, TextField, Button, Switch, FormControlLabel,
  MenuItem, Select, InputLabel, FormControl, Divider,
} from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import { COLORS } from "../theme/theme";

export default function PopupBanner() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} lg={7}>
        <Card sx={{ p: 3, mb: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">Festival Popup Banner</Typography>
            <FormControlLabel
              control={<Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
              label={<Typography sx={{ fontSize: "0.8rem" }}>{enabled ? "Active" : "Inactive"}</Typography>}
              labelPlacement="start"
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Banner Headline" fullWidth defaultValue="✨ Diwali Mega Sale is Here!" />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Sub Text" fullWidth defaultValue="Flat 40% off on all products. Use code DIWALI40 at checkout." />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Button Text" fullWidth defaultValue="Shop Now" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Button Link" fullWidth defaultValue="/collections/diwali-sale" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Start Date" type="date" fullWidth defaultValue="2026-10-15" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="End Date" type="date" fullWidth defaultValue="2026-11-01" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Display Frequency</InputLabel>
                <Select label="Display Frequency" defaultValue="once-per-session">
                  <MenuItem value="every-visit">Every Visit</MenuItem>
                  <MenuItem value="once-per-session">Once per Session</MenuItem>
                  <MenuItem value="once-per-day">Once per Day</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Theme</InputLabel>
                <Select label="Theme" defaultValue="festive-gold">
                  <MenuItem value="festive-gold">Festive Gold</MenuItem>
                  <MenuItem value="minimal-dark">Minimal Dark</MenuItem>
                  <MenuItem value="seasonal-red">Seasonal Red</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, mb: 1.2 }}>Banner Image</Typography>
          <Box
            sx={{
              border: `1.5px dashed ${COLORS.primary}`, borderRadius: "14px", p: 4, textAlign: "center",
              bgcolor: COLORS.primaryLight, cursor: "pointer",
            }}
          >
            <CloudUploadRoundedIcon sx={{ fontSize: 30, color: COLORS.primary, mb: 1 }} />
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>Click or drag to upload banner image</Typography>
            <Typography sx={{ fontSize: "0.72rem", color: COLORS.textMuted, mt: 0.3 }}>Recommended: 800×600px, JPG/PNG</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 3 }}>
            <Button variant="outlined" sx={{ borderColor: COLORS.border, color: COLORS.textDark }}>Discard</Button>
            <Button variant="contained">Publish Popup</Button>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} lg={5}>
        <Card sx={{ p: 3, position: "sticky", top: 90 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Live Preview</Typography>
          <Box
            sx={{
              borderRadius: "18px", p: 4, textAlign: "center", color: "#fff",
              background: "linear-gradient(135deg, #B8860B, #FFD700)",
              boxShadow: "0px 10px 30px rgba(184,134,11,0.35)",
            }}
          >
            <CampaignRoundedIcon sx={{ fontSize: 34, mb: 1.5 }} />
            <Typography sx={{ fontWeight: 800, fontSize: "1.15rem", mb: 1 }}>✨ Diwali Mega Sale is Here!</Typography>
            <Typography sx={{ fontSize: "0.82rem", mb: 2, opacity: 0.95 }}>
              Flat 40% off on all products. Use code DIWALI40 at checkout.
            </Typography>
            <Button variant="contained" sx={{ bgcolor: "#fff", color: "#B8860B", "&:hover": { bgcolor: "#f5f5f5" } }}>
              Shop Now
            </Button>
          </Box>
          <Typography sx={{ fontSize: "0.72rem", color: COLORS.textMuted, mt: 2, textAlign: "center" }}>
            This is how the popup will appear to customers on page load.
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
}
