import express from 'express'
import "./database/db.connection.js"
import userRouter from './modules/User/user.routes.js'
import { AppError } from './utils/error.js'
import companyRouter from './modules/Company/company.routes.js'
import jobRouter from './modules/Job/job.routes.js'
import 'dotenv/config'


process.on('uncaughtException', (err) => {
    console.log('uncaughtException Error' + err)
    // process.exit(1);
})  // to handel errors outside express , to listen to errors 


const app = express()
const port = 3000

app.use(express.json())
app.use(express.static('uploads'))

app.use('/users', userRouter)
app.use('/companies', companyRouter)
app.use('/jobs', jobRouter)

app.use('*', (req, res, next) => {  // handel 404 error in paths 
    next(new AppError(req.originalUrl + ' is not found'))
})

app.use((err, req, res, next) => {  // Error global middleware
    const { message, statusCode } = err
    res.status(statusCode || 500).json({ message })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

process.on("unhandledRejection", (err) => {
    console.log("unhandledRejection Error", err)
    // process.exit(1);
})   // to handel errors outside express , to listen to errors 