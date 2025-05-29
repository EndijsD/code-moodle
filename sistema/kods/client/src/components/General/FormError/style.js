import { Typography, keyframes, styled } from '@mui/material';

const shift = keyframes`
  50% {
    background-position: 90% 100%;
  }
`;

export const Error = styled(Typography)({
  fontWeight: '500',
  fontStyle: 'italic',
  borderRadius: '50px 0 0 50px',
  background: 'linear-gradient(90deg, rgba(255,0,0,.5), transparent 50%)',
  alignSelf: 'center',
  padding: '.5rem 1rem',
  animation: `${shift} 3s .5s ease infinite`,
  backgroundSize: '200% 100%',
});
