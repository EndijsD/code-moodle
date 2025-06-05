import express from 'express'
import cors from 'cors'
import routes from './routes.js'
import cookieParser from 'cookie-parser'

const app = express()
const port = process.env.PORT

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: 104857600 })) // 100 MB limit
app.use(cookieParser())
app.use('/', routes)

app.listen(port, () => console.log(`Server is running on port ${port}`))
