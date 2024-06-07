import { Box, Button, Paper, styled } from '@mui/material';

export const Content = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
});

export const MainBox = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '25px',
  padding: '4rem',
  background: 'linear-gradient(45deg, orange, orangered)',
});

export const H1 = styled('h1')({
  color: 'white',
  textShadow: '1px 1px black',
});

export const ToLandingButton = styled(Button)({
  color: 'white',
  textDecoration: 'underline',
  textUnderlinePosition: 'under',
});
