import Link from "../Link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Grid,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  SwipeableDrawer,
  IconButton,
  Box,
} from "@mui/material";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { routes } from "../../lib/data/routes";
import { useThemeMode } from "../../lib/ThemeContext";

function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const ToolbarMargin = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
  marginBottom: '5em',
  [theme.breakpoints.down('md')]: {
    marginBottom: '4em',
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: '2em',
  },
}));

const Header = () => {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDrawer, setOpenDrawer] = useState(false);
  const router = useRouter();
  const path = routes;

  const linkStyles = {
    fontSize: "1.25em",
    color: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main,
    "&:hover": {
      color: theme.palette.info.main,
    },
  };

  const themeToggleButton = (
    <IconButton
      onClick={toggleTheme}
      sx={{
        color: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main,
        ml: matches ? 0 : 2,
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      }}
      aria-label="Toggle dark mode"
    >
      {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );

  const tabs = (
    <Grid container justifyContent="center" spacing={4} alignItems="center">
      {path.map(({ name, link }) => (
        <Grid item key={link}>
          <Link href={link}>
            <Typography
              sx={{
                ...linkStyles,
                fontWeight: router.pathname === link ? "bold" : "normal",
                borderBottom: router.pathname === link ? "1px solid #757ce8" : "none",
              }}
            >
              {name}
            </Typography>
          </Link>
        </Grid>
      ))}
      <Grid item>
        {themeToggleButton}
      </Grid>
    </Grid>
  );

  const drawer = (
    <>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onOpen={() => setOpenDrawer(true)}
        anchor="right"
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            padding: "0 6em",
          }
        }}
      >
        <ToolbarMargin />
        <List disablePadding>
          {path.map(({ name, link }) => (
            <ListItem
              key={link}
              divider
              onClick={() => setOpenDrawer(false)}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemText disableTypography>
                <Link href={link}>
                  <Typography
                    sx={{
                      color: router.pathname === link ? theme.palette.text.primary : theme.palette.text.secondary,
                      fontWeight: router.pathname === link ? "bold" : "normal",
                    }}
                  >
                    {name}
                  </Typography>
                </Link>
              </ListItemText>
            </ListItem>
          ))}
          <ListItem sx={{ justifyContent: 'center', mt: 2 }}>
            {themeToggleButton}
          </ListItem>
        </List>
      </SwipeableDrawer>
      <IconButton
        onClick={() => setOpenDrawer(!openDrawer)}
        disableRipple
        sx={{
          marginLeft: "auto",
          padding: 0,
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
      >
        <MenuIcon
          sx={{
            height: 50,
            width: 50,
            color: theme.palette.mode === 'dark' ? theme.palette.primary.main : "#fff",
            [theme.breakpoints.down('sm')]: {
              height: 40,
              width: 40,
            },
          }}
        />
      </IconButton>
    </>
  );

  return (
    <>
      <ElevationScroll>
        <AppBar>
          <Toolbar
            disableGutters
            sx={{
              maxWidth: "1280px",
              margin: "0 auto",
              width: "100%",
              padding: matches ? "0 16px" : "24px",
            }}
          >
            {matches ? drawer : tabs}
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <ToolbarMargin />
    </>
  );
};

export default Header;
