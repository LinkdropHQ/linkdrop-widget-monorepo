import connectDB from './config/db'
import logger from './src/utils/logger'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import safesRoutes from './src/routes/safes'
import transactionsRoutes from './src/routes/transactions'
import accountsRoutes from './src/routes/accounts'
import config from './config/config'
import cookieParser from 'cookie-parser'

const app = express()

// Init middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ extended: false }))
app.use(
  cors({
      origin: ['http://localhost:9002', 'https://rinkeby-widget.linkdrop.io'],
      credentials: true
  })
)
app.use(cookieParser(config.COOKIE_SECRET))

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body, null, 2)
})

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms \n:body',
    { stream: logger.stream }
  )
)

// connect to database
connectDB()
  .then(() => {
    const PORT = process.env.PORT || process.env.CUSTOM_PORT || 5050

    app.listen(PORT, () => {
      logger.info(`Safe relay service is up at http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    logger.error(`${err}\n`)
    process.exit(1)
  })

// Define routes
app.get('/', (req, res) => res.send('Safe Relay Service'))
app.use('/api/v1/safes', safesRoutes)
app.use('/api/v1/safes/execute', transactionsRoutes)
app.use('/api/v1/accounts', accountsRoutes)

// Boom error handling middleware
app.use((err, req, res, next) => {
  if (err.isBoom) {
    // Log the error
    logger.error(err.output.payload.message)
    res.status(err.output.statusCode).json({ error: err.output.payload })
  } else {
    logger.error(err.message)
    res.status(500).json({ error: err.message })
  }
})
