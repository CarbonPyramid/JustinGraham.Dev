import React from "react";
import dynamic from 'next/dynamic';
import { useTheme } from "@mui/material/styles";
import { Container, Grid, Typography, Popover, Box } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import GitHubIcon from "@mui/icons-material/GitHub";
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

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

const socialMedia = {
  workin: "https://my.indeed.com/p/justing-7gpei7g",
  github: "https://github.com/devjustingraham",
};

const Footer = () => {
  const theme = useTheme();
  const { workin, github } = socialMedia;
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
    [theme.breakpoints.down('sm')]: {
      width: 25,
      height: 25,
    },
    "&:hover": {
      color: theme.palette.info.main,
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.main,
        width: "100%",
        position: "relative",
        overflow: "hidden",
        marginTop: "6em",
        padding: "2em 0",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="center">
          <Grid
            item
            component="a"
            target="_blank"
            rel="noreferrer noopener"
            href="tel:4792220451"
          >
            <PhoneIcon sx={iconStyles} color="secondary" />
          </Grid>
          <Grid
            item
            component="a"
            target="_blank"
            rel="noreferrer noopener"
            href={workin}
          >
            <WorkOutlineIcon sx={iconStyles} color="secondary" />
          </Grid>
          <Grid
            item
            component="a"
            target="_blank"
            rel="noreferrer noopener"
            href={github}
          >
            <GitHubIcon sx={iconStyles} color="secondary" />
          </Grid>
          <Player
            trackList={tracks}
            showPlaylist={true}
            autoPlayNextTrack={true}
          />
          <Grid item component="div">
            <PlayCircleFilledIcon
              onClick={handleClick}
              sx={{ ...iconStyles, cursor: 'pointer' }}
              color="secondary"
            />
            <Popover
              sx={{ width: "100%" }}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Player
                trackList={tracks}
                includeTags={true}
                includeSearch={true}
                showPlaylist={true}
                autoPlayNextTrack={true}
              />
            </Popover>
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
