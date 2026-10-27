import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid, Card, Box, Typography, TextField, Button, MenuItem, Select,
  InputLabel, FormControl, InputAdornment, Chip, Switch, Divider,
  CircularProgress, Alert, Stack,
} from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import { COLORS } from "../theme/theme";
import { AddProduct } from "../Api/services/Services";

// Local design tokens layered on top of the shared theme, so this form reads
// as a distinct "inventory" surface rather than another generic MUI card.
const INK = COLORS.textDark;
const MUTED = COLORS.textMuted;
const HAIRLINE = COLORS.border;
const SURFACE = COLORS.bg;
const ACCENT = "#0E7C66"; // deep teal — "in stock / ready to publish"
const ACCENT_SOFT = COLORS.primaryLight;
const DANGER = COLORS.danger;
const FONT_BODY = `"DM Sans", "Roboto", "Helvetica", Arial, sans-serif`;
const FONT_DATA = `"IBM Plex Mono", "SFMono-Regular", Menlo, monospace`;

const CATEGORIES = ["Electronics", "Apparel", "Footwear", "Accessories", "Shirts"];
const STATUSES = ["Active", "Draft", "Out of Stock"];

const emptyForm = {
  name: "",
  short_description: "",
  detailed_description: "",
  price: "",
  compare_at_price: "",
  sku: "",
  stock_quantity: "",
  category: CATEGORIES[0],
  status: "Active",
  visible_on_storefront: true,
  track_inventory: true,
};

function SectionLabel({ children }) {
  return (
    <Typography
      sx={{
        fontFamily: FONT_BODY,
        fontSize: "1.05rem",
        fontWeight: 600,
        color: INK,
        mb: 2,
      }}
    >
      {children}
    </Typography>
  );
}

function fieldSx(mono) {
  return {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      fontFamily: mono ? FONT_DATA : FONT_BODY,
      fontSize: "0.92rem",
      "& fieldset": { borderColor: HAIRLINE },
      "&:hover fieldset": { borderColor: "#C7C7C2" },
      "&.Mui-focused fieldset": { borderColor: ACCENT, borderWidth: "1.5px" },
    },
    "& .MuiInputLabel-root": { fontFamily: FONT_BODY, fontSize: "0.88rem" },
    "& .MuiInputLabel-root.Mui-focused": { color: ACCENT },
  };
}

export default function ProductForm() {
  const [form, setForm] = useState(emptyForm);
  const [tags, setTags] = useState(["Bestseller", "New"]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState([]); // [{ file, previewUrl }]
  const [status, setStatus] = useState({ state: "idle", message: "" }); // idle | saving | success | error
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setTags((t) => [...t, tagInput.trim()]);
      setTagInput("");
    }
  };
  const removeTag = (t) => setTags((prev) => prev.filter((x) => x !== t));

  const handleFilesSelected = (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
    const next = files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...next]);
  };
  const removeImage = (idx) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const buildFormData = (statusOverride) => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("short_description", form.short_description);
    fd.append("detailed_description", form.detailed_description);
    fd.append("price", form.price);
    fd.append("compare_at_price", form.compare_at_price);
    fd.append("sku", form.sku);
    fd.append("stock_quantity", form.stock_quantity);
    fd.append("category", form.category);
    fd.append("status", statusOverride || form.status);
    fd.append("tags", JSON.stringify(tags));
    fd.append("visible_on_storefront", String(form.visible_on_storefront));
    fd.append("track_inventory", String(form.track_inventory));
    images.forEach(({ file }) => fd.append("images", file, file.name));
    return fd;
  };

  const submit = async (statusOverride) => {
    if (!form.name.trim()) {
      setStatus({ state: "error", message: "Product name is required." });
      return;
    }
    setStatus({ state: "saving", message: "" });
    try {
      const response = await AddProduct(buildFormData(statusOverride));
      if (response?.status && (response.status < 200 || response.status >= 300)) {
        throw new Error(response?.data?.message || `Request failed with status ${response.status}`);
      }
      setStatus({ state: "success", message: "Product saved." });
      navigate("/products");
    } catch (err) {
      const serverMessage = err?.response?.data?.message;
      setStatus({ state: "error", message: serverMessage || err.message || "Something went wrong while saving." });
    }
  };

  const saving = status.state === "saving";

  return (
    <Box sx={{ bgcolor: SURFACE, p: { xs: 2, md: 3 }, borderRadius: "12px" }}>
      <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 2.5 }}>
        <InventoryRoundedIcon sx={{ color: ACCENT, fontSize: 22 }} />
        <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: "1.3rem", color: INK }}>
          Add product
        </Typography>
      </Stack>

      {status.state === "error" && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: "8px" }}>
          {status.message}
        </Alert>
      )}
      {status.state === "success" && (
        <Alert severity="success" sx={{ mb: 2.5, borderRadius: "8px" }}>
          {status.message}
        </Alert>
      )}

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 3, mb: 2.5, borderRadius: "10px", border: `1px solid ${HAIRLINE}`, boxShadow: "none" }}>
            <SectionLabel>Basic information</SectionLabel>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Product name"
                  fullWidth
                  value={form.name}
                  onChange={setField("name")}
                  sx={fieldSx()}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Short description"
                  fullWidth
                  multiline
                  rows={2}
                  value={form.short_description}
                  onChange={setField("short_description")}
                  sx={fieldSx()}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Detailed description"
                  fullWidth
                  multiline
                  rows={4}
                  value={form.detailed_description}
                  onChange={setField("detailed_description")}
                  sx={fieldSx()}
                />
              </Grid>
            </Grid>
          </Card>

          <Card sx={{ p: 3, mb: 2.5, borderRadius: "10px", border: `1px solid ${HAIRLINE}`, boxShadow: "none" }}>
            <SectionLabel>Pricing &amp; inventory</SectionLabel>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price"
                  fullWidth
                  value={form.price}
                  onChange={setField("price")}
                  InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                  sx={fieldSx(true)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Compare at price"
                  fullWidth
                  value={form.compare_at_price}
                  onChange={setField("compare_at_price")}
                  InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                  sx={fieldSx(true)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="SKU" fullWidth value={form.sku} onChange={setField("sku")} sx={fieldSx(true)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Stock quantity"
                  fullWidth
                  type="number"
                  value={form.stock_quantity}
                  onChange={setField("stock_quantity")}
                  sx={fieldSx(true)}
                />
              </Grid>
            </Grid>
          </Card>

          <Card sx={{ p: 3, borderRadius: "10px", border: `1px solid ${HAIRLINE}`, boxShadow: "none" }}>
            <SectionLabel>Product images</SectionLabel>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 1.5 }}>
              {images.map((img, i) => (
                <Box
                  key={img.previewUrl}
                  sx={{
                    width: 92, height: 92, borderRadius: "8px", border: `1px solid ${HAIRLINE}`,
                    position: "relative", overflow: "hidden", bgcolor: "#fff",
                  }}
                >
                  <Box
                    component="img"
                    src={img.previewUrl}
                    alt={img.file.name}
                    sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  {i === 0 && (
                    <Box
                      sx={{
                        position: "absolute", left: 0, bottom: 0, right: 0, bgcolor: "rgba(28,30,33,0.72)",
                        color: "#fff", fontSize: "0.6rem", fontFamily: FONT_BODY, textAlign: "center", py: "2px",
                      }}
                    >
                      Cover
                    </Box>
                  )}
                  <Box
                    onClick={() => removeImage(i)}
                    sx={{
                      position: "absolute", top: -6, right: -6, bgcolor: DANGER, color: "#fff",
                      borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center",
                      justifyContent: "center", cursor: "pointer",
                    }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 13 }} />
                  </Box>
                </Box>
              ))}
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  width: 92, height: 92, borderRadius: "8px", border: `1.5px dashed ${ACCENT}`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  color: ACCENT, cursor: "pointer", bgcolor: ACCENT_SOFT,
                }}
              >
                <CloudUploadRoundedIcon sx={{ fontSize: 20 }} />
                <Typography sx={{ fontSize: "0.65rem", mt: 0.5, fontFamily: FONT_BODY }}>Upload</Typography>
              </Box>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                  handleFilesSelected(e.target.files);
                  e.target.value = "";
                }}
              />
            </Box>
            <Typography sx={{ fontSize: "0.72rem", color: MUTED, fontFamily: FONT_BODY }}>
              PNG or JPG, up to 5MB each. First image is used as the cover.
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, mb: 2.5, borderRadius: "10px", border: `1px solid ${HAIRLINE}`, boxShadow: "none" }}>
            <SectionLabel>Organize</SectionLabel>
            <FormControl fullWidth sx={{ mb: 2, ...fieldSx() }}>
              <InputLabel>Category</InputLabel>
              <Select label="Category" value={form.category} onChange={setField("category")}>
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2, ...fieldSx() }}>
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={form.status} onChange={setField("status")}>
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, mb: 1, color: INK, fontFamily: FONT_BODY }}>
              Tags
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.7, mb: 1.2 }}>
              {tags.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  size="small"
                  onDelete={() => removeTag(t)}
                  sx={{ bgcolor: ACCENT_SOFT, color: ACCENT, fontFamily: FONT_BODY, fontWeight: 500 }}
                />
              ))}
            </Box>
            <TextField
              placeholder="Type and press Enter"
              size="small"
              fullWidth
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              sx={fieldSx()}
            />

            <Divider sx={{ my: 2.5, borderColor: HAIRLINE }} />

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography sx={{ fontSize: "0.83rem", fontFamily: FONT_BODY, color: INK }}>
                Visible on storefront
              </Typography>
              <Switch
                checked={form.visible_on_storefront}
                onChange={(e) => setForm((f) => ({ ...f, visible_on_storefront: e.target.checked }))}
                sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: ACCENT }, "& .Mui-checked + .MuiSwitch-track": { bgcolor: ACCENT } }}
              />
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ fontSize: "0.83rem", fontFamily: FONT_BODY, color: INK }}>
                Track inventory
              </Typography>
              <Switch
                checked={form.track_inventory}
                onChange={(e) => setForm((f) => ({ ...f, track_inventory: e.target.checked }))}
                sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: ACCENT }, "& .Mui-checked + .MuiSwitch-track": { bgcolor: ACCENT } }}
              />
            </Stack>
          </Card>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
            <Button
              variant="contained"
              size="large"
              disabled={saving}
              onClick={() => submit(form.status)}
              sx={{
                borderRadius: "8px", py: 1.2, bgcolor: ACCENT, textTransform: "none",
                fontFamily: FONT_BODY, fontWeight: 600, fontSize: "0.95rem",
                "&:hover": { bgcolor: "#0B6455" },
              }}
            >
              {saving ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Save product"}
            </Button>
            <Button
              variant="outlined"
              size="large"
              disabled={saving}
              onClick={() => submit("Draft")}
              sx={{
                borderRadius: "8px", py: 1.2, borderColor: HAIRLINE, color: INK,
                textTransform: "none", fontFamily: FONT_BODY, fontWeight: 600, fontSize: "0.95rem",
                "&:hover": { borderColor: ACCENT, bgcolor: ACCENT_SOFT },
              }}
            >
              Save as draft
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
