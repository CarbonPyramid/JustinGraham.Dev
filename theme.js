import { createTheme } from '@mui/material/styles';

const mainBlack = "#212121";
const mainWhite = "#fafafa";
const blue = "#757ce8";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: mainBlack,
    },
    secondary: {
      main: mainWhite,
    },
    info: {
      main: blue,
    },
    background: {
      default: '#f9f9f9',
    },
  },
  typography: {
    h1: {
      fontSize: "2.25rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: mainBlack,
        },
      },
    },
  },
});

export default theme;
