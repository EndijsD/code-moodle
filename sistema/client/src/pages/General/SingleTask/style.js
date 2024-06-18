import { Box, Typography, keyframes, styled } from '@mui/material';

const gradient = keyframes`
    from, to {
		background-position: 0% 50%;
	}
	50% {
        background-position: 100% 50%;
	}
`;

//   backgroundSize: '400% 400%',
//   animation: `${gradient} 15s ease infinite`,
//   background: 'linear-gradient(90deg, rgba(255, 165, 0, .1), rgba(255, 69, 0, .1), transparent)',

export const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background:
    'linear-gradient(90deg, transparent, rgba(255, 165, 0, .1), transparent, rgba(255, 69, 0, .1), transparent)',
});
