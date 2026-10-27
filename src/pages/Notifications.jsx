import React, { useState } from "react";
import {
  Card, Box, Typography, Avatar, Button, Tabs, Tab, IconButton, Tooltip,
} from "@mui/material";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { COLORS } from "../theme/theme";
import { notifications as initialNotifications } from "../data/mockData";

const iconMap = {
  order: { icon: <ShoppingBagRoundedIcon />, color: COLORS.primary },
  stock: { icon: <Inventory2RoundedIcon />, color: COLORS.warning },
  review: { icon: <RateReviewRoundedIcon />, color: COLORS.secondary },
  system: { icon: <SettingsSuggestRoundedIcon />, color: COLORS.info },
};

export default function Notifications() {
  const [tab, setTab] = useState(0);
  const [items, setItems] = useState(initialNotifications);

  const filtered = tab === 0 ? items : items.filter((n) => n.unread);

  const remove = (id) => setItems((prev) => prev.filter((n) => n.id !== id));
  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <Card sx={{ p: 0, overflow: "hidden" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, pt: 2 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} textColor="primary" indicatorColor="primary">
          <Tab label="All Notifications" sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.85rem" }} />
          <Tab label={`Unread (${items.filter((n) => n.unread).length})`} sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.85rem" }} />
        </Tabs>
        <Button size="small" onClick={markAllRead} sx={{ mb: 1 }}>Mark all as read</Button>
      </Box>

      <Box>
        {filtered.length === 0 && (
          <Box sx={{ py: 6, textAlign: "center", color: COLORS.textMuted }}>No notifications here 🎉</Box>
        )}
        {filtered.map((n) => {
          const meta = iconMap[n.type] || iconMap.system;
          return (
            <Box
              key={n.id}
              sx={{
                display: "flex", alignItems: "center", gap: 2, px: 3, py: 2,
                borderTop: `1px solid ${COLORS.border}`,
                backgroundColor: n.unread ? COLORS.primaryLight + "55" : "transparent",
              }}
            >
              <Avatar sx={{ bgcolor: `${meta.color}1A`, color: meta.color, borderRadius: "12px" }}>{meta.icon}</Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: "0.87rem", fontWeight: n.unread ? 600 : 400 }}>{n.text}</Typography>
                <Typography sx={{ fontSize: "0.73rem", color: COLORS.textMuted }}>{n.time}</Typography>
              </Box>
              {n.unread && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: COLORS.primary }} />}
              <Tooltip title="Remove">
                <IconButton size="small" onClick={() => remove(n.id)}>
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        })}
      </Box>
    </Card>
  );
}
