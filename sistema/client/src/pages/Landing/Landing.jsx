import { Box, Paper } from "@mui/material";
import * as S from "./style";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <>
      <S.HeadingBox>
        <S.H1>Nosaukums</S.H1>
      </S.HeadingBox>
      <S.box>
        <Paper>
          <Box>
            <Link to="/login">Pieslēgties</Link>
            <Link>Rēģistrēties</Link>
          </Box>
          <Box>
            <h2>Par vietni</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
              sed iure quod cum itaque, commodi mollitia perspiciatis eum id,
              fuga quos repellat ut voluptate molestias vitae. Possimus porro
              facilis iusto!
            </p>
          </Box>
        </Paper>
      </S.box>
    </>
  );
};

export default Landing;
