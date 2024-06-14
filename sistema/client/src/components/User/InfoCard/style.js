import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  keyframes,
  styled,
} from '@mui/material';

const problem = keyframes`
  from, to {
    border-color: transparent;
  }
  50% {
    border-color: red;
  }
`;

export const StyledCard = styled(Card)(({ error }) => ({
  animation: error == 'true' && `${problem} 2s linear 3`,
  borderRadius: '25px',
  minWidth: 275,
  position: 'relative',
  border: 'solid 2px transparent',

  '&:hover': {
    '#cardActions': {
      display: 'flex',
    },
  },
}));

export const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
});

export const StyledCardActions = styled(CardActions)({
  display: 'none',
  position: 'absolute',
  top: 0,
  width: '100%',
  height: '100%',
  padding: 0,
  filter: 'blur(100px)',
});

export const StyledButton = styled(Button)(({ bg }) => ({
  height: '100%',
  width: '50%',

  '&:hover': {
    background: 'rgba(' + bg + ',.5)',
  },
  '&:active': {
    background: 'rgba(' + bg + ',.3)',
  },
  '& .MuiTouchRipple-root': {
    color: 'white',
  },
}));

export const NameSurname = styled(Typography)({
  fontSize: 30,
  display: 'inline',
});

export const HighlightLetter = styled(Typography)({
  fontSize: 40,
  fontWeight: 'bold',
  color: '#363537',
});
