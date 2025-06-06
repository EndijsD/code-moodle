import { Box, Grid, Typography, useMediaQuery } from '@mui/material'
import useAxios from '../../../hooks/useAxios'
import InfoCard from '../../../components/Student/InfoCard'
import Title from '../../../components/General/Title'
import axios from 'axios'
import Spinner from '../../../components/General/Spinner/Spinner'
import NoItems from '../../../components/General/NoItems/NoItems'

const Students = () => {
  const { data, setData, isPending } = useAxios({ url: 'custom/newStudents' })
  const belowMd = useMediaQuery((theme) => theme.breakpoints.down('md'))

  const getClassType = (schoolType) => {
    return ['Tehnikums', 'Augstskola'].includes(schoolType)
      ? '. kurss'
      : '. klase'
  }

  const handleAccept = (ID, setError) => {
    axios
      .patch('custom/acceptOrReject/' + ID, { akceptets: true })
      .then(() => {
        setData((prev) => prev.filter((el) => el.studenti_id != ID))
      })
      .catch(() => {
        setError(true)

        setTimeout(() => {
          setError(false)
        }, 6000)
      })
  }

  const handleDeny = (ID, setError) => {
    axios
      .patch('custom/acceptOrReject/' + ID, { akceptets: false })
      .then(() => {
        setData((prev) => prev.filter((el) => el.studenti_id != ID))
      })
      .catch(() => {
        setError(true)

        setTimeout(() => {
          setError(false)
        }, 6000)
      })
  }

  return (
    <>
      <Title text='Studentu Pieņemšana' />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          justifyContent: data && data.length ? 'flex-start' : 'center',
        }}
      >
        {isPending ? (
          <Spinner />
        ) : data && data.length ? (
          <Grid
            container
            spacing={4}
            sx={{ justifyContent: belowMd && 'center', textAlign: 'center' }}
          >
            {data.map((user) => {
              return (
                <InfoCard
                  key={user.studenti_id}
                  ID={user.studenti_id}
                  name={user.vards}
                  surname={user.uzvards}
                  email={user.epasts}
                  school={user.nosaukums}
                  schoolClass={user.klase + getClassType(user.tips)}
                  onAccept={handleAccept}
                  onDeny={handleDeny}
                />
              )
            })}
          </Grid>
        ) : (
          <NoItems description={'Nav jauni pieprasījumi!'} />
        )}
      </Box>
    </>
  )
}

export default Students
