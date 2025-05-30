import axios from 'axios'
import { useEffect, useState } from 'react'

const useAxios = ({ method = 'get', url, body, params, doEffect = false }) => {
  const [data, setData] = useState(null)
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState(null)
  // const [initialLoad, setInitialLoad] = useState(true)

  const axiosRequest = ({
    passedMethod = 'get',
    passedUrl,
    passedBody,
    passedParams,
  }) => {
    return axios({
      method: method || passedMethod,
      url: url || passedUrl,
      data: body || passedBody,
      params: params || passedParams,
    })
      .then((response) => {
        if (response?.data) setData(response.data)

        return response
      })
      .catch((error) => {
        setError(error)

        throw error
      })
      .finally(() => {
        setIsPending(false)
        // setInitialLoad(false)
      })
  }

  useEffect(() => {
    if (!doEffect) return

    axiosRequest({})
  }, [url])

  const request = (settings = {}) => {
    return axiosRequest({
      passedMethod: settings?.method,
      passedBody: settings?.body,
      passedParams: settings?.params,
      passedUrl: settings?.url,
    })
  }

  return { data, setData, isPending, error, request } //, initialLoad
}

export default useAxios
