import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import { Box, Button, Typography } from '@mui/material'

const stringToColor = (string) => {
  let hash = 0
  let i

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }

  return color
}

const stringAvatar = (name) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  }
}

const TeacherCard = ({ name, onClick }) => {
  return (
    <Button
      variant='outlined'
      sx={{
        borderRadius: 9999,
        borderWidth: '2px',
        display: 'flex',
        justifyContent: 'flex-start',
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          pt: 0.5,
          pb: 0.5,
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Avatar {...stringAvatar(name)} />
        <Typography sx={{ fontWeight: 'bold' }}>{name}</Typography>
      </Box>
    </Button>
  )
}

export default TeacherCard
