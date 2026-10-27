import React, { useState } from "react";
import {
  Card, Box, Typography, Rating, Avatar, Chip, TextField, Button,
  Divider, Tabs, Tab,
} from "@mui/material";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import { COLORS } from "../theme/theme";
import { reviews as initialReviews } from "../data/mockData";

export default function Reviews() {
  const [reviews, setReviews] = useState(initialReviews.map((r) => ({ ...r, replyText: "" })));
  const [tab, setTab] = useState(0);

  const filtered = tab === 0 ? reviews : reviews.filter((r) => !r.replied);

  const setReplyText = (id, text) =>
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, replyText: text } : r)));

  const sendReply = (id) =>
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, replied: true } : r)));

  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Customer Reviews</Typography>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="All Reviews" sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.83rem" }} />
          <Tab label="Needs Reply" sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.83rem" }} />
        </Tabs>
      </Box>

      {filtered.map((r) => (
        <Box key={r.id}>
          <Box sx={{ py: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
              <Avatar sx={{ bgcolor: COLORS.primary }}>{r.customer[0]}</Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                  <Typography sx={{ fontWeight: 600, fontSize: "0.88rem" }}>{r.customer}</Typography>
                  <Chip label={r.product} size="small" sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary }} />
                  {!r.replied && <Chip label="Needs Reply" size="small" color="warning" />}
                </Box>
                <Rating value={r.rating} readOnly size="small" sx={{ my: 0.5 }} />
                <Typography sx={{ fontSize: "0.85rem", color: COLORS.textDark, mb: 0.5 }}>{r.comment}</Typography>
                <Typography sx={{ fontSize: "0.7rem", color: COLORS.textMuted }}>{r.date}</Typography>

                <Box sx={{ mt: 1.5, display: "flex", gap: 1 }}>
                  <TextField
                    placeholder={r.replied ? "Reply already sent ✓" : "Write a reply to this review…"}
                    size="small"
                    fullWidth
                    value={r.replyText}
                    disabled={r.replied}
                    onChange={(e) => setReplyText(r.id, e.target.value)}
                  />
                  <Button
                    variant="contained"
                    disabled={r.replied || !r.replyText.trim()}
                    startIcon={<ReplyRoundedIcon fontSize="small" />}
                    onClick={() => sendReply(r.id)}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    Reply
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
          <Divider />
        </Box>
      ))}

      {filtered.length === 0 && (
        <Box sx={{ py: 6, textAlign: "center", color: COLORS.textMuted }}>All caught up — no reviews need a reply 🎉</Box>
      )}
    </Card>
  );
}
