import React from "react";
import {
  Alert, Box, Button, Card, Chip, CircularProgress, Grid, LinearProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from "@mui/material";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { COLORS } from "../theme/theme";
import { ViewProduct, ViewCategory, BlogList } from "../Api/services/Services";

const unpack = (result, key) => {
  const payload = result?.data ?? result;
  if (!payload?.success) throw new Error(payload?.message || `Could not load ${key}.`);
  return Array.isArray(payload[key]) ? payload[key] : [];
};

const getCategoryName = (category) =>
  typeof category === "string" ? category : category?.name || "Uncategorized";

const StatCard = ({ title, value, caption, icon, tint }) => (
  <Card sx={{ p: 2.5, height: "100%" }}>
    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
      <Box>
        <Typography variant="body2" sx={{ mb: 1 }}>{title}</Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.textDark }}>{value}</Typography>
      </Box>
      <Box sx={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 2, color: tint, bgcolor: `${tint}18` }}>
        {icon}
      </Box>
    </Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>{caption}</Typography>
  </Card>
);

const SectionHeading = ({ title, subtitle, action }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 2.5 }}>
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
      {subtitle && <Typography variant="body2" sx={{ mt: 0.35 }}>{subtitle}</Typography>}
    </Box>
    {action}
  </Box>
);

export default function Dashboard() {
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [blogs, setBlogs] = React.useState([]);
  const [errors, setErrors] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const loadDashboard = React.useCallback(async () => {
    setLoading(true);
    const [productResult, categoryResult, blogResult] = await Promise.allSettled([
      ViewProduct(), ViewCategory(), BlogList(),
    ]);
    const nextErrors = [];
    const readResult = (result, key, label, setter) => {
      if (result.status === "rejected") {
        nextErrors.push(`${label}: ${result.reason?.response?.data?.message || result.reason?.message || "Request failed."}`);
        setter([]);
        return;
      }
      try {
        setter(unpack(result.value, key));
      } catch (error) {
        nextErrors.push(`${label}: ${error.message}`);
        setter([]);
      }
    };
    readResult(productResult, "products", "Products", setProducts);
    readResult(categoryResult, "categories", "Categories", setCategories);
    readResult(blogResult, "blogs", "Blogs", setBlogs);
    setErrors(nextErrors);
    setLoading(false);
  }, []);

  React.useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const activeProducts = products.filter((product) => product.status?.toLowerCase() === "active").length;
  const inStock = products.filter((product) => Number(product.stock_quantity) > 0).length;
  const categoryCounts = products.reduce((counts, product) => {
    const name = getCategoryName(product.category);
    counts.set(name, (counts.get(name) || 0) + 1);
    return counts;
  }, new Map());
  const maxCategoryCount = Math.max(1, ...categoryCounts.values());

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Store overview</Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>Live inventory and content from your store</Typography>
        </Box>
        <Button variant="outlined" startIcon={<RefreshRoundedIcon />} onClick={loadDashboard} disabled={loading}>
          Refresh data
        </Button>
      </Box>

      {errors.map((error) => <Alert severity="error" key={error} sx={{ mb: 1.5 }}>{error}</Alert>)}

      {loading ? (
        <Box sx={{ minHeight: 280, display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} xl={3}>
              <StatCard title="Products" value={products.length} caption="Products returned by the API" tint={COLORS.primary} icon={<Inventory2RoundedIcon />} />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <StatCard title="Categories" value={categories.length} caption="Store categories returned by the API" tint={COLORS.info} icon={<CategoryRoundedIcon />} />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <StatCard title="Active products" value={activeProducts} caption="Products with Active status" tint={COLORS.success} icon={<CheckCircleRoundedIcon />} />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <StatCard title="Blog posts" value={blogs.length} caption="Posts returned by the API" tint={COLORS.warning} icon={<ArticleRoundedIcon />} />
            </Grid>
          </Grid>

          <Card sx={{ mb: 3, overflow: "hidden" }}>
            <Box sx={{ p: { xs: 2, sm: 3 }, pb: 1 }}>
              <SectionHeading title="All products" subtitle={`${products.length} records from the product API`} />
            </Box>
            <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead><TableRow>
                  <TableCell>Product</TableCell><TableCell>Category</TableCell><TableCell>SKU</TableCell>
                  <TableCell align="right">Price</TableCell><TableCell align="right">Stock</TableCell><TableCell>Status</TableCell>
                </TableRow></TableHead>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow hover key={product.id || product._id || `${product.name}-${index}`}>
                      <TableCell sx={{ fontWeight: 600 }}>{product.name || "Untitled product"}</TableCell>
                      <TableCell>{getCategoryName(product.category)}</TableCell>
                      <TableCell>{product.sku || "—"}</TableCell>
                      <TableCell align="right">{product.price == null ? "—" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number(product.price) || 0)}</TableCell>
                      <TableCell align="right">{product.stock_quantity ?? "—"}</TableCell>
                      <TableCell><Chip size="small" label={product.status || "Unknown"} color={product.status?.toLowerCase() === "active" ? "success" : product.status?.toLowerCase().includes("stock") ? "error" : "default"} variant="outlined" /></TableCell>
                    </TableRow>
                  ))}
                  {!products.length && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5, color: "text.secondary" }}>No product records were returned.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          <Grid container spacing={2.5}>
            <Grid item xs={12} lg={6}>
              <Card sx={{ p: { xs: 2, sm: 3 }, height: "100%" }}>
                <SectionHeading title="All categories" subtitle={`${categories.length} records from the category API`} />
                {categories.length ? categories.map((category, index) => (
                  <Box key={category.id || category._id || index} sx={{ py: 1.5, borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{category.name || "Untitled category"}</Typography>
                      {category.description && <Typography variant="body2" sx={{ mt: 0.25 }}>{category.description}</Typography>}
                    </Box>
                    {category.status && <Chip size="small" label={category.status} variant="outlined" />}
                  </Box>
                )) : <Typography variant="body2">No category records were returned.</Typography>}
              </Card>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Card sx={{ p: { xs: 2, sm: 3 }, height: "100%" }}>
                <SectionHeading title="All blog posts" subtitle={`${blogs.length} records from the blog API`} />
                {blogs.length ? blogs.map((blog, index) => (
                  <Box key={blog.id || blog._id || index} sx={{ py: 1.5, borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>{blog.title || "Untitled post"}</Typography>
                      <Typography variant="body2" sx={{ mt: 0.25 }}>{blog.author || ""}</Typography>
                    </Box>
                    {blog.status && <Chip size="small" label={blog.status} variant="outlined" />}
                  </Box>
                )) : <Typography variant="body2">No blog records were returned.</Typography>}
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
