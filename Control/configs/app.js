'use strict'

// Importaciones 
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import { config } from "dotenv"
import courseRoutes from '../src/course/course.routes.js'
import userRoutes from '../src/user/user.routes.js'

// Configuraciones
const app = express()
config()

const port = process.env.PORT || 3056 

// Configuraciones del servidor 
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors()) // Aceptar o denegar solicitudes de diferentes origenes (local, remote) / Políticas de acceso
app.use(helmet()) // Aplica la capa basica del servidor 
app.use(morgan('dev')) // logs de solicitudes al servidor http

// Declaración de rutas
app.use('/course',courseRoutes)
app.use('/user', userRoutes)



// Levantar el servidor 
export const initServer = () => {
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}
 
