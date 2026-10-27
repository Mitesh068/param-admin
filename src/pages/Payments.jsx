import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert, Box, Button, Card, Chip, CircularProgress, InputAdornment, MenuItem,
  Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { PaymentList } from "../Api/services/Services";

const getPaymentRows = (response) => {
  const payload = response?.data ?? response;
  if (!payload?.success) throw new Error(payload?.message || "Could not load payments.");
  if (!Array.isArray(payload.data)) throw new Error("The payment API returned an unexpected response.");
  return payload.data;
};

const statusColor = (status) => ({
  paid: "success", successful: "success", completed: "success",
  created: "info", pending: "warning", failed: "error", refunded: "info",
}[`${status}`.toLowerCase()] || "default");

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? `${value}` : date.toLocaleString();
};

const formatAmount = (value, currency = "INR") => {
  const amount = Number(value);
  if (Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount);
};

const dash = (value) => (value === null || value === undefined || value === "" ? "—" : value);

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setPayments(getPaymentRows(await PaymentList()));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPayments(); }, [loadPayments]);

  const statuses = useMemo(
    () => ["All", ...new Set(payments.map((p) => p.payment_status || "Unknown"))],
    [payments]
  );

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return payments.filter((p) => {
      const status = p.payment_status || "Unknown";
      const haystack = `${p.order_number ?? ""} ${p.razorpay_order_id ?? ""} ${p.razorpay_payment_id ?? ""}`.toLowerCase();
      return (statusFilter === "All" || status === statusFilter) && haystack.includes(query);
    });
  }, [payments, search, statusFilter]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Payments</Typography>
        <Typography variant="body2" color="text.secondary">View payment transactions and their status.</Typography>
      </Box>

      {error && (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={loadPayments}>Retry</Button>} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "space-between", p: 2.5 }}>
          <TextField
            size="small"
            placeholder="Search order or transaction"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }}
            sx={{ width: { xs: "100%", sm: 300 } }}
          />
          <TextField select size="small" label="Payment status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 170 }}>
            {statuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </Box>

        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                {["Payment ID", "Order", "Razorpay Order", "Razorpay Payment", "Customer ID", "Method", "Amount", "Status", "Date"].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={9} align="center" sx={{ py: 5 }}><CircularProgress size={28} /></TableCell></TableRow>
              ) : filteredPayments.length === 0 ? (
                <TableRow><TableCell colSpan={9} align="center" sx={{ py: 5, color: "text.secondary" }}>No payments found.</TableCell></TableRow>
              ) : filteredPayments.map((p) => (
                <TableRow hover key={p.payment_record_id}>
                  <TableCell>{dash(p.payment_record_id)}</TableCell>
                  <TableCell>{dash(p.order_number)}</TableCell>
                  <TableCell>{dash(p.razorpay_order_id)}</TableCell>
                  <TableCell>{dash(p.razorpay_payment_id)}</TableCell>
                  <TableCell>{dash(p.customer_id)}</TableCell>
                  <TableCell>{dash(p.payment_method)}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{formatAmount(p.amount ?? p.total_amount, p.currency || "INR")}</TableCell>
                  <TableCell>
                    <Chip size="small" label={p.payment_status || "Unknown"} color={statusColor(p.payment_status)} variant="outlined" />
                  </TableCell>
                  <TableCell>{formatDate(p.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}