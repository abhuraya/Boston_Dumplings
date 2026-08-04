import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8f5139",
      light: "#c78f76",
      dark: "#603526",
      contrastText: "#fffaf5",
    },
    secondary: {
      main: "#7d8a72",
      light: "#b8c1af",
      dark: "#505c48",
    },
    background: {
      default: "#fbf8f2",
      paper: "#fffdf9",
    },
    text: {
      primary: "#302b27",
      secondary: "#706960",
    },
    divider: "rgba(78, 63, 53, 0.14)",
    success: {
      main: "#64785c",
    },
  },
  typography: {
    fontFamily:
      '"Avenir Next", Avenir, "Segoe UI", Helvetica, Arial, sans-serif',
    h1: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontWeight: 400,
      letterSpacing: "-0.045em",
      lineHeight: 0.98,
    },
    h2: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontWeight: 400,
      letterSpacing: "-0.032em",
      lineHeight: 1.08,
    },
    h3: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontWeight: 400,
      lineHeight: 1.15,
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 44,
          paddingInline: 22,
          borderRadius: 999,
          boxShadow: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0 24px 70px rgba(78, 63, 53, 0.09)",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
  },
});

export default theme;
