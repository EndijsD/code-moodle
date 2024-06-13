import axios from 'axios';
import { useEffect, useState } from 'react';

const useAxios = (url) => {
  const [data, setData] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setIsPending(false));
  }, [url]);

  return { data, setData, isPending, error };
};

export default useAxios;
