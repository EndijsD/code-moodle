import {
  Box,
  Button,
  TextField,
  Typography,
  alpha,
  keyframes,
  styled,
} from '@mui/material'

const gradient = keyframes`
    from, to {
		background-position: 0% 50%;
	}
	50% {
        background-position: 100% 50%;
	}
`

//   backgroundSize: '400% 400%',
//   animation: `${gradient} 15s ease infinite`,
//   background: 'linear-gradient(90deg, rgba(255, 165, 0, .1), rgba(255, 69, 0, .1), transparent)',

export const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background:
    'linear-gradient(90deg, transparent, rgba(255, 165, 0, .1), transparent, rgba(255, 69, 0, .1), transparent)',
})

export const CodeEditor = {
  fontSize: 16,
  minHeight: 300,
  fontFamily:
    'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
}

export const Tab = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ active, theme }) => ({
  border: '2px solid black',
  borderBottom: 0,
  borderRadius: '5px 5px 0 0',
  p: '2px',
  background: active ? '#161b22' : undefined, // alpha(theme.palette.primary.main, 0.2)
  cursor: 'pointer',
  color: active ? theme.palette.common.white : theme.palette.common.black,
  borderBottom: '2px solid white',
}))

export const LanguageBtn = styled(Button)(({ variant }) => ({
  color: 'white',
  borderColor: 'white',

  '&:hover': {
    background: variant != 'contained' ? 'rgba(255,255,255,.2)' : undefined,
    borderColor: 'white',
  },
}))

export const Search = styled(TextField)({
  width: '100%',

  'label, & label.Mui-focused': {
    color: 'white',
  },

  '&:hover .MuiInputBase-root:before, .MuiInputBase-root:before, .MuiInputBase-root:after':
    {
      borderColor: 'white !important',
    },

  input: {
    color: 'white',
  },
})

export const StyledTextField = styled(TextField)({
  width: '100%',

  'label, & label.Mui-focused': {
    color: 'white',
  },

  input: {
    color: 'white',
  },

  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
})
