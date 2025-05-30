import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import url from '../../../../url'
import useAxios from '../../../hooks/useAxios'
import ModuleAccordion from '../../../components/User/ModuleAccordion'
import Title from '../../../components/General/Title'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

const Tasks = () => {
  const { studentID } = useParams()
  const auth = useAuthUser()
  const { data, isPending } = useAxios(
    url +
      'custom/modules_tasks/' +
      (auth.userType == 1 ? studentID : auth.userID)
  )

  return !isPending ? (
    data.length ? (
      <>
        <Title
          text={auth.userType == 1 ? data[0].vardsUzvards : 'Veicamie Uzdevumi'}
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
              isTeacher={auth.userType == 1}
              studentIDFromTeacher={studentID}
            />
          )
        })}
      </>
    ) : (
      <Box sx={{ height: '100%', alignContent: 'center' }}>
        <Typography>
          {auth.userType == 1
            ? 'Studentam nav uzdoti moduļi'
            : 'Nav veicamo uzdevumu'}
        </Typography>
      </Box>
    )
  ) : (
    <Box sx={{ height: '100%', alignContent: 'center' }}>
      <CircularProgress />
    </Box>
  )
}

export default Tasks
