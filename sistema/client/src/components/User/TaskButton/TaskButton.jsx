import { Box, Button, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import * as S from './style';

const TaskButton = ({ i, title, topic, id }) => {
  const theme = useTheme();

  return (
    <Link to={id.toString()}>
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
              sx={{ color: theme.palette.text.secondary, fontSize: 12 }}
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
        </Box>
        {/* <Typography>
              this is button this is link Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit
              amet blandit leo lobortis eget.
            </Typography> */}
        {/* <Forward
            sx={{
              fontSize: 50,
              // color: 'white',
              // stroke: theme.palette.primary.main,
              // strokeWidth: 2,
            }}
          /> */}
      </S.AnimButton>
    </Link>
  );
};

export default TaskButton;
