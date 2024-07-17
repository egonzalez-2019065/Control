import { Router } from 'express'
import { test, login, updateUser, deleteUser, registerStudent, registerTeacher} from './user.controller.js'
import { validateJwt, isOneSelf, isAdmin } from '../middlewares/validate-jwt.js'

const api = Router()

api.get('/test',[validateJwt], test)
api.post('/registerStudent', registerStudent)
api.post('/registerTeacher',[validateJwt], [isAdmin], registerTeacher)
api.post('/login', login)
api.put('/update/:id',[validateJwt],[isOneSelf], updateUser)
api.delete('/delete/:id',[validateJwt],[isOneSelf], deleteUser)

export default api
