import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const titleMap = {
  "/": "Dashboard",
  "/products": "Product List",
  "/products/add": "Add / Edit Product",
  "/categories": "Categories",
  "/categories/add": "Add Category",
  "/orders": "Orders",
  "/payments": "Payments",
  "/blogs": "Blogs",
  "/marketing/popup-banner": "Festival Popup Banner",
  "/marketing/home-banner": "Home Page Banner",
  "/reviews": "Reviews & Replies",
  "/notifications": "Notifications",
  "/profile": "My Profile",
};

export default function DashboardLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const title = titleMap[location.pathname] || "Dashboard";

  React.useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "background.default" }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header title={title} onMenuClick={() => setMobileOpen(true)} />
        <Box sx={{ p: { xs: 2, sm: 2.5, lg: 3.5 }, flexGrow: 1, width: "100%", minWidth: 0 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
