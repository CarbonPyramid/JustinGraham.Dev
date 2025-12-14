import React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LottieWrapper from '../../LottieWrapper';

export default function LottiePopover() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen2 = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose2 = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen2}
          onMouseLeave={handlePopoverClose2}
          variant="h1"
          align="center"
          gutterBottom
          sx={{ marginBottom: "1em" }}
        >
          <a
            style={{ textDecoration: "none", color: "black", display: "flex" }}
            href="./Lottie"
          >
            <LottieWrapper />
          </a>
        </Typography>
      </Box>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
          maxWidth: '80%',
          display: "flex",
          justifyContent: "center"
        }}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose2}
        disableRestoreFocus
        disableScrollLock
      >
        <Typography sx={{ display: "flex", textAlign: "center", margin: "1rem" }}>
          Lottie animations make it possible to create the most engaging web
          user interfaces due to their small size. There are tons of other
          benefits and I also detail more about how to use it effectively. Click
          for more information.
        </Typography>
      </Popover>
    </Box>
  );
}
