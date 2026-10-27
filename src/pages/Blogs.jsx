import React, { useState, useEffect } from "react";
import {
  Card, Box, Typography, Button, Table, TableHead, TableBody, TableRow,
  TableCell, Chip, IconButton, TextField, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, MenuItem, Select, FormControl, InputLabel,
  CircularProgress, Alert,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { COLORS } from "../theme/theme";
import { BlogList, AddBlog, DeletBlog } from "../Api/services/Services";

const EMPTY_FORM = { title: "", content: "", author: "", status: "Draft" };

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null); // blog object pending delete confirmation
  const [deletingId, setDeletingId] = useState(null); // id currently being deleted
  const [deleteError, setDeleteError] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await BlogList();
      const payload = response?.data ?? response;
      if (payload?.success) {
        setBlogs(payload.blogs || []);
      } else {
        setError(payload?.message || "Failed to fetch blogs");
      }
    } catch (err) {
      setError(err?.message || "Something went wrong while fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setOpenForm(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    setForm({
      title: b.title || "",
      content: b.content || "",
      author: b.author || "",
      status: b.status || "Draft",
    });
    setFormError(null);
    setOpenForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setOpenForm(false);
  };

  const handleFieldChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.author.trim()) {
      setFormError("Title and author are required.");
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        // No update API provided yet — update locally for now.
        setBlogs((prev) =>
          prev.map((b) => (b.id === editing.id ? { ...b, ...form } : b))
        );
        setOpenForm(false);
      } else {
        const response = await AddBlog(form);
        const payload = response?.data ?? response;
        if (payload?.success) {
          if (payload.blog) {
            setBlogs((prev) => [payload.blog, ...prev]);
          } else {
            await fetchBlogs();
          }
          setOpenForm(false);
        } else {
          setFormError(payload?.message || "Failed to add blog post");
        }
      }
    } catch (err) {
      setFormError(err?.message || "Something went wrong while saving");
    } finally {
      setSaving(false);
    }
  };

  // --- Delete flow ---
  const askDelete = (blog) => {
    setDeleteError(null);
    setDeleteTarget(blog);
  };

  const cancelDelete = () => {
    if (deletingId) return;
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeletingId(id);
    setDeleteError(null);
    try {
      const response = await DeletBlog(id);
      const payload = response?.data ?? response;
      if (payload?.success !== false) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        setDeleteTarget(null);
      } else {
        setDeleteError(payload?.message || "Failed to delete blog post");
      }
    } catch (err) {
      setDeleteError(err?.message || "Something went wrong while deleting");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleDateString();
  };

  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 1.5, mb: 2.5 }}>
        <Typography variant="h6">Blog Posts</Typography>
        <Box sx={{ display: "flex", gap: 1.2 }}>
          <TextField
            placeholder="Search blog posts…"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 18, color: COLORS.textMuted }} /></InputAdornment> }}
            sx={{ width: 240 }}
          />
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openNew}>New Post</Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: COLORS.textMuted }}>
                  No blog posts found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((b) => (
                <TableRow key={b.id} hover>
                  <TableCell sx={{ fontWeight: 600, maxWidth: 280 }}>{b.title}</TableCell>
                  <TableCell>{b.author}</TableCell>
                  <TableCell>{formatDate(b.created_at)}</TableCell>
                  <TableCell>
                    <Chip label={b.status} size="small" color={b.status === "Live" ? "success" : "warning"} variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small"><VisibilityRoundedIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => openEdit(b)}><EditRoundedIcon fontSize="small" /></IconButton>
                    <IconButton
                      size="small"
                      onClick={() => askDelete(b)}
                      disabled={deletingId === b.id}
                    >
                      {deletingId === b.id ? (
                        <CircularProgress size={16} />
                      ) : (
                        <DeleteOutlineRoundedIcon fontSize="small" sx={{ color: COLORS.danger }} />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Add/Edit dialog */}
      <Dialog open={openForm} onClose={closeForm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editing ? "Edit Blog Post" : "New Blog Post"}</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFormError(null)}>
              {formError}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 0.2 }}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                value={form.title}
                onChange={handleFieldChange("title")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Content"
                fullWidth
                multiline
                rows={5}
                placeholder="Write your blog content here…"
                value={form.content}
                onChange={handleFieldChange("content")}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Author"
                fullWidth
                value={form.author}
                onChange={handleFieldChange("author")}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={form.status}
                  onChange={handleFieldChange("status")}
                >
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Live">Live</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0.5 }}>
          <Button onClick={closeForm} disabled={saving} sx={{ color: COLORS.textDark }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? <CircularProgress size={20} color="inherit" /> : editing ? "Save Changes" : "Publish Post"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onClose={cancelDelete} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Blog Post</DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setDeleteError(null)}>
              {deleteError}
            </Alert>
          )}
          <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
            Are you sure you want to delete{" "}
            <strong>{deleteTarget?.title}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0.5 }}>
          <Button onClick={cancelDelete} disabled={!!deletingId} sx={{ color: COLORS.textDark }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
            disabled={!!deletingId}
          >
            {deletingId ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}