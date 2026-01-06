import { createTheme } from '@mui/material/styles';

const mainBlack = "#212121";
const mainWhite = "#fafafa";
const blue = "#757ce8";

const baseTypography = {
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
};

export const createLightTheme = () => createTheme({
  palette: {
    mode: 'light',
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
      paper: '#ffffff',
    },
    text: {
      primary: mainBlack,
      secondary: '#666666',
    },
  },
  typography: baseTypography,
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

export const createDarkTheme = () => createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: mainWhite,
    },
    secondary: {
      main: mainBlack,
    },
    info: {
      main: blue,
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: mainWhite,
      secondary: '#b0b0b0',
    },
  },
  typography: baseTypography,
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: mainWhite,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
        },
      },
    },
  },
});

// Default export for backwards compatibility
const theme = createLightTheme();
export default theme;
