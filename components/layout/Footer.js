import React from "react";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTheme } from "@mui/material/styles";
import { Container, Grid, Typography, Popover, Box } from "@mui/material";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import EmailIcon from '@mui/icons-material/Email';

const Player = dynamic(() => import("../audio-player/index"), { ssr: false });

const tracks = [
  {
    url: "/mp3/Mr FijiWiji - The Mentalist.mp3",
    title: "Mr FijiWiji - The Mentalist",
    tags: ["chill"],
  },
  {
    url: "/mp3/Rameses B - We Are the Universe.mp3",
    title: "Rameses B - We Are the Universe",
    tags: ["chill"],
  },
  {
    url: "/mp3/Quantic - Time Is The Enemy.mp3",
    title: "Quantic - Time Is The Enemy",
    tags: ["chill"],
  }
];

const Footer = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const iconStyles = {
    width: 30,
    height: 30,
    color: '#fff',
    [theme.breakpoints.down('sm')]: {
      width: 25,
      height: 25,
    },
    "&:hover": {
      color: theme.palette.info.main,
    },
    cursor: 'pointer',
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#212121',
        width: "100%",
        position: "relative",
        overflow: "hidden",
        marginTop: "6em",
        padding: "2em 0",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
            <PlayCircleFilledIcon
              onClick={handleClick}
              sx={iconStyles}
            />
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              keepMounted
              disableScrollLock
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              slotProps={{
                paper: {
                  sx: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    overflow: 'visible',
                    marginBottom: '10px',
                  }
                }
              }}
            >
              <Box sx={{ width: 500 }}>
                <Player
                  trackList={tracks}
                  showPlaylist={true}
                  autoPlayNextTrack={true}
                  autoPlay={true}
                />
              </Box>
            </Popover>
          </Grid>
          <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/Contact" style={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon
                sx={iconStyles}
              />
            </Link>
          </Grid>
        </Grid>
        <Grid
          item
          container
          component="a"
          target="_blank"
          rel="noreferrer noopener"
          href="https://justingraham.dev"
          justifyContent="center"
          sx={{
            textDecoration: "none",
            margin: "1.2em 0"
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontSize: "1em",
              "&:hover": {
                color: theme.palette.info.main,
              },
            }}
          >
            &copy; Justin Graham
          </Typography>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
