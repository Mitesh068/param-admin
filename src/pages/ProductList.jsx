import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card, Box, Typography, TextField, InputAdornment, Button, Table, TableHead,
  TableBody, TableRow, TableCell, Chip, IconButton, Avatar, Menu, MenuItem,
  TablePagination, Select, FormControl, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Alert,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { COLORS } from "../theme/theme";
import { ViewProduct, DeleteProduct } from "../Api/services/Services";

// Relative image paths from the API (e.g. "/uploads/products/xyz.jpeg") get
// this prefixed on. Point it at your API's origin; leave "" if the frontend
// is served from the same origin/proxy as the backend.
const ASSET_BASE_URL = "http://localhost:5000";

const statusColor = (status) => ({
  Active: "success", "Out of Stock": "error", Draft: "warning",
}[status] || "default");

// Maps one raw record from GET /api/products/get-products into the shape
// this table renders.
const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: Number(p.price) || 0,
  stock: p.stock_quantity,
  status: p.status,
  image: p.images?.[0] ? `${ASSET_BASE_URL}${p.images[0]}` : null,
  raw: p,
});

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await ViewProduct();
        // Support either an axios response ({ data: {...} }) or a plain
        // payload, depending on how axiosGet is wrapped in your project.
        const payload = response?.data ?? response;
        if (!payload?.success) {
          throw new Error(payload?.message || "Failed to load products.");
        }
        if (!cancelled) {
          setProducts((payload.products || []).map(mapProduct));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || err.message || "Failed to load products.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filtered = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openMenu = (e, row) => { setMenuAnchor(e.currentTarget); setActiveRow(row); };
  const closeMenu = () => setMenuAnchor(null);

  const openDeleteDialog = () => {
    setDeleteError("");
    setDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    if (deleting) return; // don't let the dialog close mid-request
    setDeleteDialog(false);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!activeRow) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const response = await DeleteProduct(activeRow.id);
      const payload = response?.data ?? response;
      if (payload && payload.success === false) {
        throw new Error(payload.message || "Failed to delete product.");
      }
      setProducts((prev) => prev.filter((p) => p.id !== activeRow.id));
      setDeleteDialog(false);
      setActiveRow(null);
    } catch (err) {
      setDeleteError(err?.response?.data?.message || err.message || "Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
        <Box>
          <Typography variant="h6">All Products</Typography>
          <Typography variant="body2" sx={{ fontSize: "0.78rem" }}>{filtered.length} products found</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search products…"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 18, color: COLORS.textMuted }} /></InputAdornment>,
            }}
            sx={{ width: 220 }}
          />
          <FormControl size="small" sx={{ width: 150 }}>
            <Select value={category} onChange={(e) => setCategory(e.target.value)} sx={{ borderRadius: "10px" }}>
              {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => navigate("/products/add")}>
            Add Product
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: "8px" }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <>
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          src={p.image || undefined}
                          sx={{ bgcolor: COLORS.primaryLight, borderRadius: "10px", fontSize: "1.2rem" }}
                        >
                          {!p.image && p.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>{p.name}</Typography>
                          <Typography sx={{ fontSize: "0.72rem", color: COLORS.textMuted }}>{p.id}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>₹{p.price.toLocaleString()}</TableCell>
                    <TableCell>{p.stock}</TableCell>
                    <TableCell><Chip label={p.status} size="small" color={statusColor(p.status)} variant="outlined" /></TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => openMenu(e, p)}>
                        <MoreVertRoundedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5, color: COLORS.textMuted }}>No products found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Box>

          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(e, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5]}
          />
        </>
      )}

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu} PaperProps={{ sx: { borderRadius: 2.5 } }}>
        <MenuItem onClick={() => { closeMenu(); navigate("/products/add"); }}>
          <VisibilityRoundedIcon fontSize="small" sx={{ mr: 1.2 }} /> View
        </MenuItem>
        <MenuItem onClick={() => { closeMenu(); navigate("/products/add"); }}>
          <EditRoundedIcon fontSize="small" sx={{ mr: 1.2 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => { closeMenu(); openDeleteDialog(); }} sx={{ color: COLORS.danger }}>
          <DeleteOutlineRoundedIcon fontSize="small" sx={{ mr: 1.2 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={deleteDialog} onClose={closeDeleteDialog}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Product?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete "{activeRow?.name}"? This action cannot be undone.
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: "8px" }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button onClick={closeDeleteDialog} disabled={deleting} sx={{ color: COLORS.textDark }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={confirmDelete} disabled={deleting}>
            {deleting ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}