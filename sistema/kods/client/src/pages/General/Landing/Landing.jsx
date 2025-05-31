import { Box, Divider } from '@mui/material'
import * as S from './style'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../../context/GlobalProvider'

const Landing = () => {
  const { user } = useGlobalContext()
  const nav = useNavigate()

  const goToLogin = () => {
    if (user) {
      if (user.loma == 'students') nav('/user/tasks')
      else if (user.loma == 'skolotajs') nav('/teacher/students')
    } else {
      nav('/login')
    }
  }

  return (
    <>
      <S.HeadingBox>
        <S.H1>Code Moodle</S.H1>
      </S.HeadingBox>
      <S.Content>
        <S.StyledPaper>
          <S.LeftBox>
            <S.MainButton onClick={goToLogin}>Pieslēgties</S.MainButton>
            <Link to='register'>
              <S.MainButton>Rēģistrēties</S.MainButton>
            </Link>
          </S.LeftBox>
          <Divider orientation='vertical' flexItem />
          <Box>
            <h2>Par vietni</h2>
            <S.Paragraph>
              "Code Moodle" ir RTU Liepājas akadēmijas Informāciajas tehnoloģiju
              2.kursa studentu Kārļa Lācīša un Endija Dārznieka studiju
              projekts. "Code Moodle" ir serviss programmēšanas uzdevumu
              veidošanai, uzdošanai, veikšanai un labošanai. Vietne ir paredzēta
              studentiem, privātskolotājiem un skolām.
            </S.Paragraph>
          </Box>
        </S.StyledPaper>
      </S.Content>
    </>
  )
}

export default Landing
