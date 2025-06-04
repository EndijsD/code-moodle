import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Popover,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useGlobalContext } from '../../../context/GlobalProvider'
import axios from 'axios'
import { initStatusPending } from '../../../data/initStatus'
import Spinner from '../../../components/General/Spinner/Spinner'
import ServerError from '../../../components/General/ServerError/ServerError'
import Title from '../../../components/General/Title/Title'
import TeacherCard from '../../../components/Student/TeacherCard/TeacherCard'
import AcceptActionDialog from '../../../components/General/AcceptActionDialog/AcceptActionDialog'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import DirectionsIcon from '@mui/icons-material/Directions'

const SignUp = () => {
  const [status, setStatus] = useState(initStatusPending)
  const [teachers, setTeachers] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [includePrivate, setIncludePrivate] = useState(false)

  const { user } = useGlobalContext()

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [])

  const fetchData = () => {
    axios
      .get(`custom/accessible_teachers/${user.studenti_id}`)
      .then((res) => {
        setTeachers(res.data)
        setStatus({ success: true, error: false, pending: false })
      })
      .catch((err) => {
        console.error(err)
        setStatus({ error: true, pending: false, success: false })
      })
  }

  const handleCardClick = (teacher) => {
    setSelectedTeacher(teacher)
    setDialogOpen(true)
  }

  const handleAccept = () => {
    const postData = {
      skolotajs_id: selectedTeacher.skolotajs_id,
      studenti_id: user.studenti_id,
      akceptets: null,
    }
    axios
      .post(`skolotajs_students`, postData)
      .then(() => {
        setTeachers((prevTeachers) =>
          prevTeachers.filter(
            (t) => t.skolotajs_id !== selectedTeacher.skolotajs_id
          )
        )
        setDialogOpen(false)
        setSelectedTeacher(null)
      })
      .catch((err) => {
        console.error('Failed to apply:', err)
        setDialogOpen(false)
        setSelectedTeacher(null)
      })
  }

  const handleCancel = () => {
    setDialogOpen(false)
  }

  const filteredData = teachers
    .filter((el) => (includePrivate ? true : el.skolas_tips !== '-'))
    .filter((el) =>
      `${el.vards} ${el.uzvards}`
        .toLowerCase()
        .includes(query.trim().toLowerCase())
    )

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const handleCheckboxChange = (event) => {
    setIncludePrivate(event.target.checked)
  }

  return (
    <>
      {status.error ? (
        <ServerError />
      ) : status.pending ? (
        <Spinner />
      ) : (
        status.success && (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Title text='Pieteikties pie skolotāja' />

            {teachers.length > 0 ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                  <Paper
                    component='form'
                    sx={{
                      p: '2px 4px',
                      display: 'flex',
                      alignItems: 'center',
                      width: 400,
                    }}
                  >
                    <Popover
                      open={Boolean(anchorEl)}
                      anchorEl={anchorEl}
                      onClose={handlePopoverClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                    >
                      <Box sx={{ p: 2, minWidth: 220 }}>
                        <Typography variant='subtitle1' fontWeight='bold'>
                          Filtri
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={includePrivate}
                              onChange={handleCheckboxChange}
                            />
                          }
                          label='Iekļaut privātskolotājus'
                        />
                      </Box>
                    </Popover>

                    <InputBase
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      sx={{ ml: 1, flex: 1 }}
                      placeholder='Meklēt skolotāju'
                    />
                    <IconButton
                      sx={{ p: '10px' }}
                      onClick={handleMenuClick}
                      aria-label='menu'
                    >
                      <MenuIcon />
                    </IconButton>
                  </Paper>
                </Box>
                <Grid container spacing={2} justifyContent='center'>
                  {filteredData.map((teacher, i) => (
                    <Grid item key={i}>
                      <TeacherCard
                        key={i}
                        name={`${teacher.vards} ${teacher.uzvards}`}
                        onClick={() => handleCardClick(teacher)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <Typography textAlign={'center'}>
                Nav pieejamu skolotāju!
              </Typography>
            )}

            {/* Dialog */}
            {selectedTeacher && (
              <AcceptActionDialog
                open={dialogOpen}
                title='Apstiprināt skolotāju'
                description={`Vai tiešām vēlaties pieteikties pie ${selectedTeacher.vards} ${selectedTeacher.uzvards}?`}
                onAccept={handleAccept}
                onCancel={handleCancel}
              />
            )}
          </Box>
        )
      )}
    </>
  )
}

export default SignUp
