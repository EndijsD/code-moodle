import { Box, IconButton, styled } from '@mui/material'

export const Attachment = styled(Box)({
  '&:hover': {
    '.options': {
      display: 'flex',
    },
  },
})

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  background: theme.palette.common.white,

  '&:hover': {
    background: theme.palette.common.white,
  },
}))
