import React, { useCallback, useEffect, useState } from "react";
import {
  Alert, Card, Box, Typography, Tabs, Tab, Table, TableHead, TableBody, TableRow,
  TableCell, Chip, TextField, InputAdornment, Select, MenuItem, FormControl,
  Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Stepper,
  Step, StepLabel, Divider,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { COLORS } from "../theme/theme";
import { ViewOrders } from "../Api/services/Services";

const statusColor = (status) => ({
  Pending: "warning", Confirmed: "info", Shipped: "info", Delivered: "success", Cancelled: "error",
}[status] || "default");

const steps = ["Order Placed", "Confirmed", "Shipped", "Out for Delivery", "Delivered"];
const stepIndex = { Pending: 0, Confirmed: 1, Shipped: 2, Delivered: 4, Cancelled: 0 };

const readOrderList = (result) => {
  const payload = result?.data ?? result;
  if (Array.isArray(payload)) return payload;
  if (!payload?.success) throw new Error(payload?.message || "Could not load orders.");
  const list = payload.orders ?? payload.data?.orders ?? payload.data;
  if (!Array.isArray(list)) throw new Error("The orders API returned an unexpected response.");
  return list;
};

const normalizeOrder = (order) => {
  const customer = order.customer ?? order.user ?? {};
  const rawStatus = order.status ?? order.order_status ?? "Pending";
  const status = `${rawStatus}`.toLowerCase();
  const normalizedStatus = {
    pending: "Pending", confirmed: "Confirmed", shipped: "Shipped", delivered: "Delivered",
    cancelled: "Cancelled", canceled: "Cancelled",
  }[status] || "Pending";
  const createdAt = order.date ?? order.createdAt ?? order.created_at ?? order.order_date;

  return {
    ...order,
    id: `${order.order_number ?? order.id ?? order.order_id ?? order._id ?? ""}`,
    customer: typeof customer === "string"
      ? customer
      : ((customer.name ?? [customer.first_name, customer.last_name].filter(Boolean).join(" "))
        || customer.email || order.shipping_name || "Customer"),
    date: createdAt ? new Date(createdAt).toLocaleDateString() : "—",
    items: Array.isArray(order.items ?? order.order_items)
      ? (order.items ?? order.order_items).length
      : Number(order.items_count ?? order.items ?? 0),
    payment: order.payment_method ?? order.payment ?? "—",
    paymentStatus: order.payment_status ?? "Unknown",
    amount: Number(order.amount ?? order.total_amount ?? order.total ?? order.grand_total ?? 0),
    status: normalizedStatus,
  };
};

export default function Orders() {
  const [tab, setTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await ViewOrders();
      setOrders(readOrderList(result).map(normalizeOrder));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const tabStatus = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"][tab];

  const filtered = orders.filter(
    (o) =>
      (tabStatus === "All" || o.status === tabStatus) &&
      (statusFilter === "All" || o.status === statusFilter) &&
      (o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()))
  );

  const updateStatus = (id, status) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  return (
    <Card sx={{ p: 0 }}>
      <Box sx={{ px: 3, pt: 2 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          {["All Orders", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map((t) => (
            <Tab key={t} label={t} sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.83rem" }} />
          ))}
        </Tabs>
      </Box>
      <Divider />

      {error && <Alert severity="error" action={<Button color="inherit" size="small" onClick={loadOrders}>Retry</Button>} sx={{ mx: 3, mt: 2 }}>{error}</Alert>}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "space-between", p: 3, pb: 1.5 }}>
        <TextField
          placeholder="Search order ID or customer…"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 18, color: COLORS.textMuted }} /></InputAdornment> }}
          sx={{ width: 260 }}
        />
        <FormControl size="small" sx={{ width: 160 }}>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ px: 3, pb: 3, overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={9} align="center" sx={{ py: 5 }}><CircularProgress size={26} /></TableCell></TableRow>}
            {!loading && filtered.map((o) => (
              <TableRow key={o.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{o.id}</TableCell>
                <TableCell>{o.customer}</TableCell>
                <TableCell>{o.date}</TableCell>
                <TableCell>{o.items}</TableCell>
                <TableCell>{o.payment}</TableCell>
                <TableCell><Chip label={o.paymentStatus} size="small" color={o.paymentStatus.toLowerCase() === "paid" ? "success" : o.paymentStatus.toLowerCase() === "pending" ? "warning" : "default"} variant="outlined" /></TableCell>
                <TableCell sx={{ fontWeight: 600 }}>₹{o.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 130 }}>
                    <Select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      renderValue={(v) => <Chip label={v} size="small" color={statusColor(v)} variant="outlined" />}
                    >
                      {["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map((s) => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="right">
                  <Button size="small" startIcon={<VisibilityRoundedIcon fontSize="small" />} onClick={() => setSelected(o)}>
                    Track
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && !error && filtered.length === 0 && (
              <TableRow><TableCell colSpan={9} align="center" sx={{ py: 5, color: COLORS.textMuted }}>No orders found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        {selected && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>Order {selected.id} — Follow Up</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: "0.75rem", color: COLORS.textMuted }}>Customer</Typography>
                  <Typography sx={{ fontSize: "0.88rem", fontWeight: 600 }}>{selected.customer}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: "0.75rem", color: COLORS.textMuted }}>Amount</Typography>
                  <Typography sx={{ fontSize: "0.88rem", fontWeight: 600 }}>₹{selected.amount.toLocaleString()}</Typography>
                </Grid>
              </Grid>

              <Stepper activeStep={stepIndex[selected.status]} alternativeLabel sx={{ mb: 3 }}>
                {steps.map((label) => (
                  <Step key={label}><StepLabel sx={{ "& .MuiStepLabel-label": { fontSize: "0.7rem" } }}>{label}</StepLabel></Step>
                ))}
              </Stepper>

              <TextField
                label="Add follow-up note / message to customer"
                fullWidth
                multiline
                rows={3}
                placeholder="e.g. Your order has been shipped and will arrive in 2-3 business days."
              />
            </DialogContent>
            <DialogActions sx={{ p: 2.5, pt: 0.5 }}>
              <Button onClick={() => setSelected(null)} sx={{ color: COLORS.textDark }}>Close</Button>
              <Button variant="contained" onClick={() => setSelected(null)}>Send Update</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Card>
  );
}
