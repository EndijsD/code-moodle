import { Button, keyframes, styled } from '@mui/material'

const pulse = keyframes`
  from, to {
    box-shadow: inset -100px 0 100px -100px rgba(265, 165, 0, .3);
  }
  50% {
    box-shadow: inset -100px 0 0 -100px rgba(265, 165, 0, .3);
  }
`

export const AnimButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  gap: 2,
  width: '100%',
  background: 'linear-gradient(90deg, transparent, orangered 1000%);',
  animation: `${pulse} 3s ease infinite`,
}))

export const Main = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
}

export const ColContainer = { display: 'flex', flexDirection: 'column' }

export const itemText = { fontWeight: '500' }
