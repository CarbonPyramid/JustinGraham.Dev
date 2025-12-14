import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import Box from '@mui/material/Box';

export default function IndeedIcon(props: SvgIconProps) {
  return (
    <Box sx={{ '& > svg': { m: 2 } }}>
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    </Box>
  );
}
