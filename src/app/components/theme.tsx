import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#242F9B",     
      contrastText: "#FFFFFF", 
    },
    secondary: {
      main: "#98DED9",     
      contrastText: "#0000000", 
    },
    background: {
      default: "#ffffff", 
    },
  },

  typography: {
    fontFamily: "var(--font-mitr)",
  },
});

export default theme;