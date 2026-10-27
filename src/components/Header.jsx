import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, Box, InputBase, IconButton, Badge, Avatar,
  Menu, MenuItem, Typography, Divider, ListItemIcon, Tooltip,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { COLORS } from "../theme/theme";
import { notifications as mockNotifications } from "../data/mockData";

export default function Header({ title = "Dashboard", onMenuClick }) {
  const navigate = useNavigate();
  const [profileAnchor, setProfileAnchor] = React.useState(null);
  const [notifAnchor, setNotifAnchor] = React.useState(null);

  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: COLORS.surface,
        color: COLORS.textDark,
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1, px: { xs: 2, sm: 3 }, minHeight: { xs: 68, sm: 76 } }}>
        <Box>
          <IconButton onClick={onMenuClick} aria-label="Open navigation" sx={{ display: { xs: "inline-flex", md: "none" }, bgcolor: "#F4F6FB", float: "left", mr: 1 }}><MenuRoundedIcon /></IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
          <Typography variant="body2" sx={{ fontSize: "0.75rem", display: { xs: "none", sm: "block" } }}>Welcome back, manage your store today</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Search */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              backgroundColor: "#F4F6FB",
              borderRadius: "10px",
              px: 1.5,
              py: 0.6,
              width: { md: 200, lg: 260 },
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <SearchRoundedIcon sx={{ fontSize: 19, color: COLORS.textMuted, mr: 1 }} />
            <InputBase placeholder="Search orders and products" sx={{ fontSize: "0.85rem", width: "100%" }} />
          </Box>

          <Tooltip title="Messages"><IconButton sx={{ display: { xs: "none", sm: "inline-flex" }, backgroundColor: "#F4F6FB", borderRadius: "10px" }}>
            <MailOutlineRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton></Tooltip>

          <IconButton
            sx={{ backgroundColor: "#F4F6FB", borderRadius: "10px" }}
            onClick={(e) => setNotifAnchor(e.currentTarget)}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsRoundedIcon sx={{ fontSize: 20 }} />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notifAnchor}
            open={Boolean(notifAnchor)}
            onClose={() => setNotifAnchor(null)}
            PaperProps={{ sx: { width: 340, borderRadius: 3, mt: 1 } }}
          >
            <Box sx={{ px: 2, py: 1.2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontWeight: 700, fontSize: "0.9rem" }}>Notifications</Typography>
              <Typography sx={{ fontSize: "0.72rem", color: COLORS.primary, cursor: "pointer" }}>Mark all read</Typography>
            </Box>
            <Divider />
            {mockNotifications.slice(0, 5).map((n) => (
              <MenuItem key={n.id} sx={{ whiteSpace: "normal", py: 1.2, alignItems: "flex-start" }}>
                <Box>
                  <Typography sx={{ fontSize: "0.8rem", fontWeight: n.unread ? 600 : 400 }}>{n.text}</Typography>
                  <Typography sx={{ fontSize: "0.7rem", color: COLORS.textMuted }}>{n.time}</Typography>
                </Box>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem
              onClick={() => { setNotifAnchor(null); navigate("/notifications"); }}
              sx={{ justifyContent: "center", fontSize: "0.8rem", color: COLORS.primary, fontWeight: 600 }}
            >
              View all notifications
            </MenuItem>
          </Menu>

          <Divider orientation="vertical" flexItem sx={{ my: 1 }} />

          {/* Profile */}
          <Box
            onClick={(e) => setProfileAnchor(e.currentTarget)}
            sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
          >
            <Avatar
              src=""
              sx={{ width: 38, height: 38, borderRadius: "10px", bgcolor: COLORS.primary, fontSize: "0.85rem" }}
            >
              AK
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, lineHeight: 1.1 }}>Anita Kapoor</Typography>
              <Typography sx={{ fontSize: "0.68rem", color: COLORS.textMuted }}>Super Admin</Typography>
            </Box>
          </Box>

          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={() => setProfileAnchor(null)}
            PaperProps={{ sx: { width: 200, borderRadius: 3, mt: 1 } }}
          >
            <MenuItem onClick={() => { setProfileAnchor(null); navigate("/profile"); }}>
              <ListItemIcon><PersonRoundedIcon fontSize="small" /></ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={() => setProfileAnchor(null)}>
              <ListItemIcon><SettingsRoundedIcon fontSize="small" /></ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { setProfileAnchor(null); navigate("/login"); }} sx={{ color: COLORS.danger }}>
              <ListItemIcon><LogoutRoundedIcon fontSize="small" sx={{ color: COLORS.danger }} /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
