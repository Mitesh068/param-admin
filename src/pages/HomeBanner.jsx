import React, { useState } from "react";
import {
  Card, Box, Typography, TextField, Button, Grid, IconButton, Chip,
  Switch, FormControlLabel,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import { COLORS } from "../theme/theme";

const initialSlides = [
  { id: 1, title: "Summer Collection 2026", subtitle: "Up to 50% off on new arrivals", cta: "Shop Now", active: true, emoji: "🏖️" },
  { id: 2, title: "New Electronics Launch", subtitle: "Explore the latest gadgets", cta: "Explore", active: true, emoji: "📱" },
  { id: 3, title: "Festive Footwear Sale", subtitle: "Buy 1 Get 1 on select styles", cta: "Grab Deal", active: false, emoji: "👟" },
];

export default function HomeBanner() {
  const [slides, setSlides] = useState(initialSlides);

  const toggleActive = (id) =>
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));

  const removeSlide = (id) => setSlides((prev) => prev.filter((s) => s.id !== id));

  const addSlide = () =>
    setSlides((prev) => [
      ...prev,
      { id: Date.now(), title: "New Banner Title", subtitle: "Banner subtitle here", cta: "Learn More", active: true, emoji: "🖼️" },
    ]);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
        <Box>
          <Typography variant="h6">Home Page Banner Slides</Typography>
          <Typography variant="body2" sx={{ fontSize: "0.78rem" }}>Drag to reorder · Toggle to show/hide on homepage</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={addSlide}>Add Slide</Button>
      </Box>

      <Grid container spacing={2.5}>
        {slides.map((slide) => (
          <Grid item xs={12} key={slide.id}>
            <Card sx={{ p: 2.5 }}>
              <Grid container spacing={2.5} alignItems="center">
                <Grid item xs={12} sm="auto">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DragIndicatorRoundedIcon sx={{ color: COLORS.textMuted, cursor: "grab" }} />
                    <Box
                      sx={{
                        width: 90, height: 70, borderRadius: "12px", bgcolor: COLORS.primaryLight,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem",
                      }}
                    >
                      {slide.emoji}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Title" size="small" fullWidth defaultValue={slide.title}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField label="Subtitle" size="small" fullWidth defaultValue={slide.subtitle} />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField label="Button Text" size="small" fullWidth defaultValue={slide.cta} />
                </Grid>
                <Grid item xs={6} sm="auto">
                  <FormControlLabel
                    control={<Switch checked={slide.active} onChange={() => toggleActive(slide.id)} />}
                    label={<Chip label={slide.active ? "Live" : "Hidden"} size="small" color={slide.active ? "success" : "default"} />}
                  />
                </Grid>
                <Grid item xs={6} sm="auto" sx={{ ml: "auto" }}>
                  <IconButton onClick={() => removeSlide(slide.id)}>
                    <DeleteOutlineRoundedIcon sx={{ color: COLORS.danger }} />
                  </IconButton>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Box
            sx={{
              border: `1.5px dashed ${COLORS.border}`, borderRadius: "14px", p: 3, textAlign: "center",
              color: COLORS.textMuted, cursor: "pointer",
            }}
            onClick={addSlide}
          >
            <CloudUploadRoundedIcon sx={{ fontSize: 22, mb: 0.5 }} />
            <Typography sx={{ fontSize: "0.82rem" }}>Click to upload a new banner image and create a slide</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
