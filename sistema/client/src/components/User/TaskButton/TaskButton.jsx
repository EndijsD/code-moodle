import { Box, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import * as S from './style';

const TaskButton = ({
  i,
  title,
  topic,
  taskID,
  moduleID,
  gotten_points,
  max_points,
}) => {
  const theme = useTheme();

  return (
    <Link to={moduleID + '/' + taskID}>
      <S.AnimButton>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: 12,
                textWrap: 'nowrap',
              }}
            >
              Nr. p. k.
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>{i}</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{ color: theme.palette.text.secondary, fontSize: 12 }}
            >
              Nosaukums
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>{title}</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{ color: theme.palette.text.secondary, fontSize: 12 }}
            >
              Tēma
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>{topic}</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{ color: theme.palette.text.secondary, fontSize: 12 }}
            >
              Punkti
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>
              {(gotten_points || 0) + ' / ' + max_points}
            </Typography>
          </Box>
        </Box>
      </S.AnimButton>
    </Link>
  );
};

export default TaskButton;
