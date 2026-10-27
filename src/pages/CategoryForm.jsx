import React from "react";
import {
  Box, Typography, Paper, TextField, Button, MenuItem, Grid, Alert, CircularProgress,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { useNavigate, useSearchParams } from "react-router-dom";
import { COLORS } from "../theme/theme";
import { AddCategory } from "../Api/services/Services";


export default function CategoryForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");

  const [form, setForm] = React.useState({
    name: "",
    status: "Active",
    description: "",
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (editId) {
      // TODO: fetch category by id and prefill form
      setForm({ name: "Electronics", status: "Active", description: "" });
    }
  }, [editId]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // TODO: swap in an UpdateCategory(editId, form) call here once that API exists
      const response = await AddCategory(form);

      if (response?.success === false) {
        setError(response.message || "Something went wrong. Please try again.");
        return;
      }

      navigate("/categories");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
        {editId ? "Edit Category" : "Add Category"}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        {editId ? "Update category details" : "Create a new product category"}
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, width: "100%" }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error" onClose={() => setError("")}>
                  {error}
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                label="Category Name"
                fullWidth
                required
                value={form.name}
                onChange={handleChange("name")}
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Status"
                fullWidth
                value={form.status}
                onChange={handleChange("status")}
                disabled={submitting}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                minRows={3}
                value={form.description}
                onChange={handleChange("description")}
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", gap: 1.5, mt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />}
                disabled={submitting}
                sx={{ backgroundColor: COLORS.primary, borderRadius: 2, textTransform: "none" }}
              >
                {editId ? "Update" : "Save"} Category
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/categories")}
                disabled={submitting}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
