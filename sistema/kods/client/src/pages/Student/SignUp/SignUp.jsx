import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useGlobalContext } from '../../../context/GlobalProvider'
import axios from 'axios'
import { initStatusPending } from '../../../data/initStatus'
import Spinner from '../../../components/General/Spinner/Spinner'
import ServerError from '../../../components/General/ServerError/ServerError'
import Title from '../../../components/General/Title/Title'

const SignUp = () => {
  const [status, setStatus] = useState(initStatusPending)
  const [teachers, setTeachers] = useState(null)
  const { user } = useGlobalContext()
  useEffect(() => {
    if (user) {
      console.log(user)

      fetchData()
    }
  }, [])

  useEffect(() => {
    console.log(teachers)
  }, [teachers])

  const fetchData = () => {
    axios
      .get(`/custom/accessible_teachers/${user.studenti_id}`)
      .then((res) => {
        setTeachers(res.data)
        setStatus({ success: true, error: false, pending: false })
      })
      .catch((err) => {
        console.log(err)
        setStatus({ error: true, pending: false, success: false })
      })
  }

  return (
    <>
      {status.error ? (
        <ServerError />
      ) : status.pending ? (
        <Spinner />
      ) : (
        status.success && (
          <Box>
            <Title text='Pieteikties pie skolotāja' />
          </Box>
        )
      )}
    </>
  )
}

export default SignUp
