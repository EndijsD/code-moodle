import { Box } from '@mui/material'
import * as S from '../../../pages/General/NotFound/style'

const NoItems = ({ description, containerStyle }) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <S.MainBox style={containerStyle}>
        <S.H1>{description}</S.H1>
      </S.MainBox>{' '}
    </Box>
  )
}

export default NoItems
