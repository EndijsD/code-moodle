import { Box, Divider } from '@mui/material'
import * as S from './style'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <>
      <S.HeadingBox>
        <S.H1>Code Moodle</S.H1>
      </S.HeadingBox>
      <S.Content>
        <S.StyledPaper>
          <S.LeftBox>
            <Link to='login'>
              <S.MainButton>Pieslēgties</S.MainButton>
            </Link>
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
