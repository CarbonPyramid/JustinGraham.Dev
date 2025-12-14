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
      Justin Graham
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
            Full Stack Developer
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
          A full stack developer works with both the front and back ends of a web
          application —meaning they can integrate advanced databases and
          functionalities, build complex user interfaces and plan directly with
          customers while having a full understanding of the application from
          beginning to end. Click to read more about this distinction.
        </Typography>
      </Popover>
    </Box>
  );
}
