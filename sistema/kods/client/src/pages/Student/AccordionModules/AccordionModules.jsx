import useAxios from '../../../hooks/useAxios'
import ModuleAccordion from '../../../components/Student/ModuleAccordion'
import Title from '../../../components/General/Title'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

const AccordionModules = () => {
  const { studentID } = useParams()
  const { data, isPending } = useAxios({
    url: 'custom/modules_tasks/' + (studentID || ''),
  })

  return !isPending ? (
    data && data.length ? (
      <>
        <Title text={false ? data[0].vardsUzvards : 'Veicamie Uzdevumi'} />

        {data.map((module, i) => {
          return (
            <ModuleAccordion
              key={i}
              title={module.m_nos}
              tasks={module.uzdevumi}
              max_points={module.p_kopa}
              gotten_points={module.i_kopa}
              moduleID={module.moduli_id}
              isTeacher={false}
              studentIDFromTeacher={studentID}
            />
          )
        })}
      </>
    ) : (
      <Box sx={{ height: '100%', alignContent: 'center' }}>
        <Typography>
          {false ? 'Studentam nav uzdoti moduļi' : 'Nav veicamo uzdevumu'}
        </Typography>
      </Box>
    )
  ) : (
    <Box sx={{ height: '100%', alignContent: 'center' }}>
      <CircularProgress />
    </Box>
  )
}

export default AccordionModules
