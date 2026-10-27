import { createTheme } from "@mui/material/styles";

export const COLORS = {
  bg: "#F6F8FC",
  surface: "#FFFFFF",
  primary: "#3457D5",
  primaryDark: "#2645B5",
  primaryLight: "#EDF2FF",
  secondary: "#0F9B8E",
  sidebarBg: "#17243A",
  sidebarHover: "#23334D",
  sidebarActive: "#304665",
  textDark: "#192437",
  textMuted: "#758198",
  border: "#E7EBF2",
  danger: "#EF4444",
  warning: "#F59E0B",
  success: "#14B8A6",
  info: "#3B82F6",
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: COLORS.primary, dark: COLORS.primaryDark, light: COLORS.primaryLight, contrastText: "#fff" },
    secondary: { main: COLORS.secondary, contrastText: "#fff" },
    error: { main: COLORS.danger },
    warning: { main: COLORS.warning },
    success: { main: COLORS.success },
    info: { main: COLORS.info },
    background: { default: COLORS.bg, paper: COLORS.surface },
    text: { primary: COLORS.textDark, secondary: COLORS.textMuted },
    divider: COLORS.border,
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: `"DM Sans", "Roboto", "Helvetica", "Arial", sans-serif`,
    h1: { fontWeight: 800, fontFamily: "Manrope, sans-serif", letterSpacing: "-0.035em" },
    h2: { fontWeight: 800, fontFamily: "Manrope, sans-serif", letterSpacing: "-0.03em" },
    h3: { fontWeight: 700, fontFamily: "Manrope, sans-serif", letterSpacing: "-0.025em" },
    h4: { fontWeight: 700, fontSize: "1.5rem" },
    h5: { fontWeight: 600, fontSize: "1.15rem" },
    h6: { fontWeight: 600, fontSize: "1rem" },
    subtitle1: { fontWeight: 500 },
    body2: { color: COLORS.textMuted },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shadows: [
    "none",
    "0px 2px 6px rgba(20, 20, 60, 0.05)",
    "0px 4px 10px rgba(20, 20, 60, 0.06)",
    ...Array(22).fill("0px 6px 18px rgba(20, 20, 60, 0.08)"),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: COLORS.bg },
        "*::-webkit-scrollbar": { width: 6, height: 6 },
        "*::-webkit-scrollbar-thumb": { backgroundColor: "#CBD0E0", borderRadius: 10 },
        "*::-webkit-scrollbar-track": { backgroundColor: "transparent" },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: `1px solid ${COLORS.border}`,
          boxShadow: "0 2px 8px rgba(24, 39, 75, 0.035)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 18,
          paddingRight: 18,
          fontSize: "0.85rem",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        containedPrimary: {
          "&:hover": { backgroundColor: COLORS.primaryDark },
        },
        sizeSmall: { borderRadius: 8, padding: "5px 12px", fontSize: "0.78rem" },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    // ---- SMOOTH / SMALL / ROUNDED FORM FIELDS ----
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: "#FBFBFE",
          fontSize: "0.88rem",
          transition: "all 0.15s ease-in-out",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.border },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.primary },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: COLORS.primary,
            borderWidth: 1.5,
          },
        },
        input: {
          padding: "12px 14px",
          minHeight: 48,
        },
        notchedOutline: { borderColor: COLORS.border },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: "0.85rem" },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
    MuiFormControl: {
      defaultProps: { size: "small" },
    },
    MuiSelect: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600, fontSize: "0.72rem" },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${COLORS.border}`, fontSize: "0.85rem" },
        head: {
          fontWeight: 700,
          fontSize: "0.72rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: COLORS.textMuted,
          backgroundColor: "#FAFBFF",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 18 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: "0.7rem", borderRadius: 6 },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { padding: 8 },
        thumb: { boxShadow: "none" },
      },
    },
  },
});

export default theme;
