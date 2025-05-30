import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import TaskButton from '../TaskButton'
import * as S from './style'

const ModuleAccordion = ({
  title,
  tasks,
  max_points,
  gotten_points,
  moduleID,
  isTeacher,
  studentIDFromTeacher,
}) => {
  return (
    <Accordion sx={{ width: '100%' }}>
      <AccordionSummary expandIcon={<ExpandMore />} sx={S.AccordionSummary}>
        <Typography sx={{ fontWeight: '500', fontSize: 30 }}>
          {title}
        </Typography>
        <Typography sx={{ fontWeight: 'italic', fontSize: 20 }}>
          {gotten_points} / {max_points}
        </Typography>
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
              taskID={task.uzdevumi_id}
              moduleID={moduleID}
              gotten_points={task.i_punkti}
              max_points={task.u_punkti}
              subID={task.iesniegumi_id}
              isTeacher={isTeacher}
              studentIDFromTeacher={studentIDFromTeacher}
            />
          )
        })}
      </AccordionDetails>
    </Accordion>
  )
}

export default ModuleAccordion
