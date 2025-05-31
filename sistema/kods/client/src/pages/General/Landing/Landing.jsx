import { Box, Divider } from '@mui/material'
import * as S from './style'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../../context/GlobalProvider'

const Landing = () => {
  const { user } = useGlobalContext()
  const nav = useNavigate()

  const goTo = (route) => {
    if (user) {
      if (user.loma == 'students') nav('/user/tasks')
      else if (user.loma == 'skolotajs') nav('/teacher/students')
    } else {
      nav(route)
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
            <S.MainButton onClick={() => goTo('login')}>
              Pieslēgties
            </S.MainButton>
            <S.MainButton onClick={() => goTo('register')}>
              Rēģistrēties
            </S.MainButton>
          </S.LeftBox>

          <Divider orientation='vertical' flexItem />

          <Box>
            <h2>Par vietni</h2>
            <S.Paragraph>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
              sed iure quod cum itaque, commodi mollitia perspiciatis eum id,
              fuga quos repellat ut voluptate molestias vitae. Possimus porro
              facilis iusto!
            </S.Paragraph>
          </Box>
        </S.StyledPaper>
      </S.Content>
    </>
  )
}

export default Landing
