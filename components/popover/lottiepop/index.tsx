import React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';

const LottieWrapper = dynamic(() => import('../../LottieWrapper'), { ssr: false });

export default function LottiePopover() {
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
      <Box
        aria-owns={open ? 'lottie-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
      >
        <LottieWrapper />
      </Box>
      <Popover
        id="lottie-popover"
        sx={{
          pointerEvents: 'none',
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: '#18191f',
              padding: '1rem',
            }
          }
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
        disableScrollLock
      >
        <Typography sx={{ color: '#fff', textAlign: 'center' }}>
          Click to explore more animations
        </Typography>
      </Popover>
    </Box>
  );
}
