import { Box } from '@mui/material'
import FormError from '../FormError'

const ServerError = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <FormError text='Servera kļūda!' />
    </Box>
  )
}

export default ServerError
