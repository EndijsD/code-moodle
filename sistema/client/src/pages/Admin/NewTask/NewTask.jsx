import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import * as S from './style';
import { useState } from 'react';
import axios from 'axios';
import url from '../../../../url';
import { Check, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { languages } from '../../../languages';
import { DropzoneArea } from 'mui-file-dropzone';
import Title from '../../../components/General/Title';

const NewTask = () => {
  const nav = useNavigate();
  const fieldError =
    'Obligātam laukam ir jāsatur vismaz 1 simbolu, neskaitot atstarpes';
  const [data, setData] = useState({
    topic: '',
    name: '',
    description: '',
    language: '',
    points: '',
    example: '',
  });
  const [fieldValid, setFieldValid] = useState({
    topic: false,
    name: false,
    description: false,
    language: false,
    points: false,
  });
  const [status, setStatus] = useState({
    pending: false,
    error: false,
    success: false,
  });

  const isWhitespaceString = (str) => !/\S/.test(str); // Checks if string only contains white space returns true/false

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let incompleteData = false;
    let tempObj = { ...fieldValid };

    for (const [key, value] of Object.entries(fieldValid)) {
      if (isWhitespaceString(data[key])) {
        tempObj[key] = true;
        incompleteData = true;
      } else {
        tempObj[key] = false;
      }
    }

    if (!incompleteData) {
      const postData = {
        tema: data.topic,
        nosaukums: data.name,
        apraksts: data.description,
        valoda: data.language,
        punkti: data.points,
        piemers: data.example,
      };
      setStatus({ ...status, pending: true, error: false });
      axios
        .post(`${url}uzdevumi`, postData)
        .then(function (response) {
          if (response.data.message == 'Added entry') {
            setStatus({
              ...status,
              pending: false,
              error: false,
              success: true,
            });
          }
          // response.data.id
          // if (file) {
          //   const fd = new FormData();
          //   fd.append('file', file);
          //   //axios post (back end not dun yet)
          // }
          setTimeout(() => nav('/admin/bank'), 500);
        })
        .catch(function (error) {
          setStatus({ ...status, pending: false, error: true });
          console.log(error.response.data);
        });
    }
    setFieldValid(tempObj);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Title text="Jauns uzdevums" />
      <S.Form onSubmit={handleSubmit}>
        <TextField
          error={fieldValid.topic}
          fullWidth
          required
          label="Tēma"
          name="topic"
          onChange={handleFormInputChange}
          value={data.topic || ''}
          helperText={fieldValid.topic && fieldError}
          autoComplete="off"
        />
        <TextField
          error={fieldValid.name}
          required
          fullWidth
          label="Uzdevuma nosaukums"
          name="name"
          onChange={handleFormInputChange}
          value={data.name || ''}
          helperText={fieldValid.name && fieldError}
          autoComplete="off"
        />
        <TextField
          error={fieldValid.description}
          required
          fullWidth
          label="Apraksts"
          name="description"
          onChange={handleFormInputChange}
          value={data.description || ''}
          helperText={fieldValid.description && fieldError}
          autoComplete="off"
          multiline
        />
        <FormControl>
          <InputLabel htmlFor="prog_lan">Programmēšanas valoda</InputLabel>
          <Select
            inputProps={{ id: 'prog_lan' }}
            error={fieldValid.language}
            required
            fullWidth
            name="language"
            label="Programmēšanas valoda"
            onChange={handleFormInputChange}
            value={data.language || ''}
            autoComplete="off"
          >
            {languages.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {fieldValid.language && 'Neaizpildīts obligātais lauciņš!'}
          </FormHelperText>
        </FormControl>
        <TextField
          error={fieldValid.points}
          required
          fullWidth
          label="Punkti"
          name="points"
          type="number"
          value={data.points || ''}
          onChange={handleFormInputChange}
          autoComplete="off"
        />
        <TextField
          fullWidth
          label="Piemērs"
          name="example"
          disabled={data.language == '' ? true : false}
          helperText={
            data.language == '' ? 'Izvēlaties programmēšanas valodu!' : false
          }
          value={data.example || ''}
          onChange={handleFormInputChange}
          autoComplete="off"
        />
        <DropzoneArea
          acceptedFiles={['image/*']}
          dropzoneText={'Nomet vai uzspied'}
          onChange={(files) => console.log('Files:', files)}
          filesLimit={10}
          showPreviews
          showPreviewsInDropzone={false}
          useChipsForPreview
          previewText="Izvēlētie faili"
          dropzoneClass="dropzone"
          showAlerts={false}
        />
        <Button
          color={
            status.error ? 'error' : status.success ? 'success' : 'primary'
          }
          disabled={status.pending ? true : false}
          variant="contained"
          type="submit"
        >
          {status.pending ? (
            <CircularProgress size={24.5} />
          ) : status.success ? (
            <Check />
          ) : status.error ? (
            <Close />
          ) : (
            <>Pievienot</>
          )}
        </Button>
      </S.Form>
    </Box>
  );
};

export default NewTask;
