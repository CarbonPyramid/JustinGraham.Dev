import React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function FullStackPopover() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
           <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          variant="h1"
          align="center"
          gutterBottom
          sx={{ marginBottom: "1em", maxWidth: "37%" }}
        >
          <a
            style={{ textDecoration: "none", color: "black", display: "flex" }}
            href="./FullStackDeveloper"
          >
            Justin Graham
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
        slotProps={{
          paper: {
            sx: {
              display: "flex",
              justifyContent: "center"
            }
          }
        }}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        disableRestoreFocus
        disableScrollLock
      >
        <Typography sx={{ display: "flex", textAlign: "center", margin: "1rem" }}>
          Full Stack Developer, Engineer, & Technician             
        </Typography>
      </Popover>
    </Box>
  );
}
