import React from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, IconButton, Chip, Button, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Snackbar,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../theme/theme";
import { ViewCategory, DeleteCategory } from "../Api/services/Services"
export default function CategoryList() {
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const [deleteTarget, setDeleteTarget] = React.useState(null); // category being confirmed for delete
  const [deletingId, setDeletingId] = React.useState(null); // id currently being deleted (for spinner)
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" });

  const fetchCategories = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await ViewCategory();
      if (response?.success) {
        setCategories(response.categories || []);
      } else {
        setError(response?.message || "Failed to fetch categories.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while fetching categories."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDeleteClick = (cat) => {
    setDeleteTarget(cat);
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    setDeletingId(id);
    try {
      const response = await DeleteCategory(id);
      if (response?.success !== false) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setSnackbar({
          open: true,
          message: response?.message || "Category deleted successfully.",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: response?.message || "Failed to delete category.",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong while deleting the category.",
        severity: "error",
      });
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Categories</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Manage your product categories
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => navigate("/categories/add")}
          sx={{ backgroundColor: COLORS.primary, borderRadius: 2, textTransform: "none" }}
        >
          Add Category
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Level</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id} hover>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {cat.level ? cat.level.replace(/_/g, " ") : "-"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={cat.status}
                      size="small"
                      color={cat.status === "Active" ? "success" : "default"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/categories/add?id=${cat.id}`)}
                      disabled={deletingId === cat.id}
                    >
                      <EditRoundedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(cat)}
                      disabled={deletingId === cat.id}
                    >
                      {deletingId === cat.id ? (
                        <CircularProgress size={16} color="error" />
                      ) : (
                        <DeleteRoundedIcon fontSize="small" color="error" />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Delete confirmation dialog */}
      <Dialog open={Boolean(deleteTarget)} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deletingId !== null}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deletingId !== null}
          >
            {deletingId !== null ? <CircularProgress size={18} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}