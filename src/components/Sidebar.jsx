import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Collapse, Avatar,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import WallpaperRoundedIcon from "@mui/icons-material/WallpaperRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { COLORS } from "../theme/theme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export const SIDEBAR_WIDTH = 260;

const navItems = [
  { label: "Dashboard", icon: <DashboardRoundedIcon />, path: "/" },
  {
    label: "Products", icon: <Inventory2RoundedIcon />, key: "products",
    children: [
      { label: "Product List", icon: <Inventory2RoundedIcon fontSize="small" />, path: "/products" },
      { label: "Add / Edit Product", icon: <AddBoxRoundedIcon fontSize="small" />, path: "/products/add" },
    ],
  },
  {
    label: "Category", icon: <CategoryRoundedIcon />, key: "category",
    children: [
      { label: "Category List", icon: <CategoryRoundedIcon fontSize="small" />, path: "/categories" },
      { label: "Add Category", icon: <PlaylistAddRoundedIcon fontSize="small" />, path: "/categories/add" },
    ],
  },
  { label: "Orders", icon: <ShoppingCartRoundedIcon />, path: "/orders" },
  { label: "Payments", icon: <PaymentsRoundedIcon />, path: "/payments" },
  { label: "Blogs", icon: <ArticleRoundedIcon />, path: "/blogs" },
  {
    label: "Marketing", icon: <CampaignRoundedIcon />, key: "marketing",
    children: [
      { label: "Festival Banner Popup", icon: <CampaignRoundedIcon fontSize="small" />, path: "/marketing/popup-banner" },
      { label: "Home Page Banner", icon: <WallpaperRoundedIcon fontSize="small" />, path: "/marketing/home-banner" },
    ],
  },
  { label: "Reviews & Replies", icon: <RateReviewRoundedIcon />, path: "/reviews" },
  { label: "Notifications", icon: <NotificationsRoundedIcon />, path: "/notifications" },
  { label: "Profile", icon: <PersonRoundedIcon />, path: "/profile" },
];

export default function Sidebar({ mobileOpen = false, onMobileClose = () => {} }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState({ products: true, category: false, marketing: false });

  const isActive = (path) => location.pathname === path;

  const toggleGroup = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : undefined}
      onClose={onMobileClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: { xs: 0, md: SIDEBAR_WIDTH },
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          backgroundColor: COLORS.sidebarBg,
          color: "#fff",
          border: "none",
          ...(isMobile ? {} : { position: "sticky", height: "100vh", top: 0 }),
        },
      }}
    >
      {/* Brand */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 3, py: 3 }}>
        <Avatar sx={{ bgcolor: COLORS.primary, width: 36, height: 36, borderRadius: "10px" }}>
          <StorefrontRoundedIcon fontSize="small" />
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.1 }}>ShopSphere</Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)" }}>Admin Panel</Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <List sx={{ px: 2, py: 2, flex: 1, overflowY: "auto" }}>
        {navItems.map((item) => {
          if (item.children) {
            const groupActive = item.children.some((c) => isActive(c.path));
            return (
              <Box key={item.key} sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => toggleGroup(item.key)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.3,
                    color: groupActive ? "#fff" : "rgba(255,255,255,0.65)",
                    "&:hover": { backgroundColor: COLORS.sidebarHover },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>{item.icon}</ListItemIcon>
                  <ListItemText primaryTypographyProps={{ fontSize: "0.87rem", fontWeight: 600 }} primary={item.label} />
                  {open[item.key] ? <ExpandLessRoundedIcon fontSize="small" /> : <ExpandMoreRoundedIcon fontSize="small" />}
                </ListItemButton>
                <Collapse in={open[item.key]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.path}
                        onClick={() => navigate(child.path)}
                        selected={isActive(child.path)}
                        sx={{
                          borderRadius: 2,
                          pl: 4.5,
                          mb: 0.3,
                          color: isActive(child.path) ? "#fff" : "rgba(255,255,255,0.55)",
                          "&.Mui-selected": { backgroundColor: COLORS.sidebarActive, "&:hover": { backgroundColor: COLORS.sidebarActive } },
                          "&:hover": { backgroundColor: COLORS.sidebarHover },
                        }}
                      >
                        <ListItemIcon sx={{ color: "inherit", minWidth: 28 }}>{child.icon}</ListItemIcon>
                        <ListItemText primaryTypographyProps={{ fontSize: "0.82rem" }} primary={child.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          }

          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: isActive(item.path) ? "#fff" : "rgba(255,255,255,0.65)",
                "&.Mui-selected": { backgroundColor: COLORS.sidebarActive, "&:hover": { backgroundColor: COLORS.sidebarActive } },
                "&:hover": { backgroundColor: COLORS.sidebarHover },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontSize: "0.87rem", fontWeight: 600 }} primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            background: `linear-gradient(135deg, ${COLORS.primary}, #7C3AED)`,
            borderRadius: 3,
            p: 2,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, mb: 0.5 }}>Need help?</Typography>
          <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.8)" }}>
            Check our admin documentation
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
