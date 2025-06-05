import { createContext, useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'

const GlobalContext = createContext()
export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({ children }) => {
  const refreshPooling = useRef()
  const [user, setUser] = useState(null)
  const [initialized, setInitialized] = useState(false)

  axios.defaults.baseURL = 'http://localhost:3000'
  axios.defaults.withCredentials = true

  useEffect(() => {
    const checkAuthAndStartRefresh = async () => {
      try {
        const res = await axios.get('auth/check') // Check if accessToken is valid

        if (String(res.status).charAt(0) == '2') {
          // User is authenticated, start refresh interval
          const refresh = async () => {
            await axios.post('auth/refresh').catch(() => {
              clearInterval(refreshPooling.current)
              setUser(null)
            })
          }

          setUser(res.data)
          refresh() // Initial call
          refreshPooling.current = setInterval(refresh, 600000) // 10 min
        }
      } catch (e) {
        setUser(null)
      } finally {
        setInitialized(true)
      }
    }

    checkAuthAndStartRefresh()

    // return () => clearInterval(refreshPooling.current)
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        refreshPooling,
        user,
        setUser,
        initialized,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
