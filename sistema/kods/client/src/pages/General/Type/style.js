import { styled } from '@mui/system'
import { Box, Button, Paper, Typography } from '@mui/material'

export const MainBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  flex: 1,
  alignItems: 'center',
})

export const TypePaper = styled(Paper)({
  width: 400,
  borderRadius: 20,
  padding: '4rem 3rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
})

export const StyledBtn = styled(Button)({
  borderRadius: 50,
  fontWeight: 700,
})

export const Title = styled(Typography)(({ theme }) => ({
  fontSize: '2em',
  fontWeight: 800,
  textAlign: 'center',
  color: theme.palette.mode == 'light' && theme.palette.grey[800],
}))

export const ButtonBox = styled(Box)({
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
})
