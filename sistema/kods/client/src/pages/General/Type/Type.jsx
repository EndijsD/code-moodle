import { useEffect } from 'react'
import * as S from './style'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../../context/GlobalProvider'

const Type = () => {
  const nav = useNavigate()
  const { user, initialized } = useGlobalContext()

  // Ja lietotājs ir ielogojies, tad lietotājs tiek aizvests atpakaļ uz sava lietotāja tipa sākuma lapu
  useEffect(() => {
    if (user) {
      if (user.loma == 'students') nav('/student/modules')
      else if (user.loma == 'skolotajs') nav('/teacher/students')
    }
  }, [user])

  if (!initialized || user) return

  const handleTypeSelect = (newType) => {
    nav(`/register/${newType}`)
  }

  return (
    <S.MainBox>
      <S.TypePaper>
        <S.Title>Kas reģistrējās?</S.Title>

        <S.ButtonBox>
          <S.StyledBtn
            variant='contained'
            onClick={() => {
              handleTypeSelect('student')
            }}
          >
            Students
          </S.StyledBtn>
          <S.StyledBtn
            variant='contained'
            onClick={() => {
              handleTypeSelect('teacher')
            }}
          >
            Privātskolotājs
          </S.StyledBtn>
          <S.StyledBtn
            variant='contained'
            onClick={() => {
              handleTypeSelect('administrator')
            }}
          >
            Skola
          </S.StyledBtn>
        </S.ButtonBox>
      </S.TypePaper>
    </S.MainBox>
  )
}

export default Type
