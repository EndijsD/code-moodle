import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import TaskButton from '../TaskButton';

const ModuleAccordion = ({ title, tasks }) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          '.MuiAccordionSummary-content': {
            alignItems: 'center',
            justifyContent: 'space-between',
            mr: '16px',
          },
          '.MuiAccordionSummary-content.Mui-expanded': {
            m: '20px 16px 0 0',
          },
        }}
      >
        <Typography sx={{ fontWeight: '500', fontSize: 30 }}>
          {title}
        </Typography>
        {/* <Typography sx={{ fontWeight: 'italic', fontSize: 20 }}>0/5</Typography> */}
      </AccordionSummary>
      <AccordionDetails
        sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
      >
        {tasks.map((task, i) => {
          return (
            <TaskButton
              key={i + 1}
              i={i + 1}
              title={task.u_nos}
              topic={task.tema}
              id={task.uzdevumi_id}
            />
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};

export default ModuleAccordion;
