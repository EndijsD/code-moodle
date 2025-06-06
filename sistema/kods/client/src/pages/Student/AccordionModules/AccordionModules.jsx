import useAxios from '../../../hooks/useAxios'
import ModuleAccordion from '../../../components/Student/ModuleAccordion'
import Title from '../../../components/General/Title'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useGlobalContext } from '../../../context/GlobalProvider'
import NoItems from '../../../components/General/NoItems/NoItems'

const AccordionModules = () => {
  const { studentID } = useParams()
  const { user } = useGlobalContext()
  const { data, isPending } = useAxios({
    url: 'custom/modules_tasks/' + (studentID || user.studenti_id),
  })
  console.log(data)
  return !isPending ? (
    data && data.length ? (
      <>
        <Title
          text={
            user?.loma === 'skolotajs'
              ? data[0].vards + ' ' + data[0].uzvards
              : 'Veicamie Uzdevumi'
          }
        />

        {data.map((module, i) => {
          return (
            <ModuleAccordion
              key={i}
              title={module.m_nos}
              tasks={module.uzdevumi}
              max_points={module.p_kopa}
              gotten_points={module.i_kopa}
              moduleID={module.moduli_id}
              isTeacher={user?.loma === 'skolotajs'}
              studentIDFromTeacher={studentID}
            />
          )
        })}
      </>
    ) : (
      <Box sx={{ height: '100%', alignContent: 'center' }}>
        <NoItems
          description={
            user?.loma === 'skolotajs'
              ? 'Studentam nav uzdoti moduļi'
              : 'Nav veicamo uzdevumu'
          }
        />
      </Box>
    )
  ) : (
    <Box sx={{ height: '100%', alignContent: 'center' }}>
      <CircularProgress />
    </Box>
  )
}

export default AccordionModules
