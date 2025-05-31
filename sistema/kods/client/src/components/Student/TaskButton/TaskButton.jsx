import { Box, Typography, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'
import * as S from './style'

const TaskButton = ({
  i,
  title,
  topic,
  taskID,
  moduleID,
  gotten_points,
  max_points,
  subID,
  isTeacher,
  studentIDFromTeacher,
}) => {
  const theme = useTheme()

  return (
    <Link
      to={
        isTeacher && subID
          ? '/teacher/evaluate/' + subID
          : isTeacher && !subID
          ? '/teacher/studentProfiles/' + studentIDFromTeacher
          : moduleID + '/tasks/' + taskID
      }
    >
      <S.AnimButton disabled={isTeacher && !subID}>
        <Box sx={S.Main}>
          <Box sx={S.ColContainer}>
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                ...S.itemText,
              }}
            >
              Nr. p. k.
            </Typography>
            <Typography sx={S.itemText}>{i}</Typography>
          </Box>
          <Box sx={S.ColContainer}>
            <Typography
              sx={{ color: theme.palette.text.secondary, fontSize: 12 }}
            >
              Nosaukums
            </Typography>
            <Typography sx={S.itemText}>{title}</Typography>
          </Box>
          <Box sx={S.ColContainer}>
            <Typography
              sx={{ color: theme.palette.text.secondary, fontSize: 12 }}
            >
              Tēma
            </Typography>
            <Typography sx={S.itemText}>{topic}</Typography>
          </Box>
          <Box sx={S.ColContainer}>
            <Typography
              sx={{ color: theme.palette.text.secondary, fontSize: 12 }}
            >
              Punkti
            </Typography>
            <Typography sx={S.itemText}>
              {(gotten_points || 0) + ' / ' + max_points}
            </Typography>
          </Box>
        </Box>
      </S.AnimButton>
    </Link>
  )
}

export default TaskButton
