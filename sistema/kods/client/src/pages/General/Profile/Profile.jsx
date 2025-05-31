import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProfileDataInit } from '../../../data/General/ProfileData'
import { initStatusPending } from '../../../data/initStatus'
import { Box, CircularProgress } from '@mui/material'
import * as S from './style'

const Profile = () => {
  const nav = useNavigate()
  const [data, setData] = useState(ProfileDataInit)
  const [fieldValid, setFieldValid] = useState(ProfileDataInit)
  const [status, setStatus] = useState(initStatusPending)

  useEffect(() => {
    setTimeout(() => setStatus((prev) => ({ ...prev, pending: false })), 500) //temp loader test
  }, [])

  return (
    <Box
      sx={{
        ...S.MainContainer,
        justifyContent: status.pending ? 'center' : 'start',
      }}
    >
      {status.pending ? <CircularProgress /> : <>ha</>}
    </Box>
  )
}

export default Profile
