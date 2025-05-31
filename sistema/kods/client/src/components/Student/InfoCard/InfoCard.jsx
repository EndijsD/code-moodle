import { Typography, Grid } from '@mui/material'
import * as S from './style'
import { useState } from 'react'

const InfoCard = ({
  name,
  surname,
  school,
  schoolClass,
  email,
  onAccept,
  onDeny,
  ID,
}) => {
  const [error, setError] = useState(false)

  return (
    <Grid item xs={10} sm={8} md={6} lg={4} xl={3}>
      <S.StyledCard error={error.toString()}>
        <S.StyledCardContent id='cardContent'>
          <Typography color='text.secondary'>{email}</Typography>

          <S.NameSurname>
            <S.HighlightLetter component={'span'}>
              {name.charAt(0)}
            </S.HighlightLetter>

            {name.substring(1) + ' '}

            <S.HighlightLetter component={'span'}>
              {surname.charAt(0)}
            </S.HighlightLetter>

            {surname.substring(1)}
          </S.NameSurname>

          <Typography>{school}</Typography>

          <Typography sx={{ fontSize: 14 }}>{schoolClass}</Typography>
        </S.StyledCardContent>

        <S.StyledCardActions id='cardActions' disableSpacing>
          <S.StyledButton
            bg={'255,0,0'}
            onClick={() => onDeny(ID, setError)}
          ></S.StyledButton>

          <S.StyledButton
            bg={'0,255,0'}
            onClick={() => onAccept(ID, setError)}
          ></S.StyledButton>
        </S.StyledCardActions>
      </S.StyledCard>
    </Grid>
  )
}

export default InfoCard
