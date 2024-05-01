import { Box, Button, Paper, styled } from '@mui/material';

export const HeadingBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  background: 'linear-gradient(45deg, orange, orangered)',
  borderRadius: '0 0 100% 100%',
});

export const H1 = styled('h1')({
  margin: '2rem 0',
  color: 'white',
  textShadow: '2px 2px black',
  fontSize: '3rem',
});

export const StyledPaper = styled(Paper)({
  display: 'flex',
  alignItems: 'center',
  gap: '4rem',
  borderRadius: '25px',
  padding: '4rem',
});

export const LeftBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  alignItems: 'center',
});

export const Content = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
});

export const Paragraph = styled('p')({
  maxWidth: '30rem',
});

export const MainButton = styled(Button)({
  fontWeight: 'bolder',
  fontSize: '1.5rem',
  letterSpacing: '2px',
});
