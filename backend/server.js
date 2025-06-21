import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

// for socket
import {createServer} from 'node:http'
import {connectToSocket} from './controllers/socketManeger.js'


// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// for socket
// Create an HTTP server and attach Express app
const server = createServer(app)
// Attach Socket.io to the HTTP server
const io = connectToSocket(server)




// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)


// api endpoints
app.get('/',(req,res)=>{
    res.send('API WORKING') 
})


server.listen(port,()=> console.log(`server is listening on ${port}`))