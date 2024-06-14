import { styled } from '@mui/system';

export const Form = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '4rem 3rem',
  gap: 10,

  [theme.breakpoints.down('sm')]: {
    width: 'auto',
  },
}));
