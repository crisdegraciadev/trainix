import express from 'express'
import { Request, Response } from 'express'

import path from 'path'

const app = express()

app.set('port', process.env.PORT ?? 3000)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  express.static(path.join(__dirname, '../public'), { maxAge: 31557600000 })
)

app.get('/', (_req: Request, res: Response) => {
  return res.send('Hello world')
})

export default app
