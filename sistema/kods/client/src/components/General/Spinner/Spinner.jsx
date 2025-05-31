import { Box, CircularProgress } from '@mui/material'
import * as S from './style'

const Spinner = () => {
  return (
    <Box sx={S.SpinnerContainer}>
      <CircularProgress />
    </Box>
  )
}

export default Spinner
