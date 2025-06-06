import axios from 'axios'
import { useEffect, useState } from 'react'

const useAxios = ({
  method = 'get',
  url,
  body,
  params,
  doUseEffect = false,
  headers,
}) => {
  const [data, setData] = useState(null)
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState(null)
  // const [initialLoad, setInitialLoad] = useState(true)

  const axiosRequest = ({
    passedMethod = 'get',
    passedUrl,
    passedBody,
    passedParams,
    passedHeaders,
  }) => {
    return axios({
      method: method || passedMethod,
      url: url || passedUrl,
      data: body || passedBody,
      params: params || passedParams,
      headers: headers || passedHeaders,
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
    if (doUseEffect) return

    axiosRequest({})
  }, [url])

  const request = (settings = {}) => {
    return axiosRequest({
      passedMethod: settings?.method,
      passedBody: settings?.body,
      passedParams: settings?.params,
      passedUrl: settings?.url,
      passedHeaders: settings?.passedHeaders,
    })
  }

  return { data, setData, isPending, error, request } //, initialLoad
}

export default useAxios
