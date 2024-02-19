import { Router } from 'express'
import { courseDelete, editCourse, enrollStudent, enrollTeacher, getCourses, saveCourse, studendCourses, test } from './course.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js'
const api = Router()

api.get('/test', test)
api.post('/saveCourse', [validateJwt], [isAdmin] ,saveCourse)
api.put('/enrollTeacher/:id',[validateJwt], enrollTeacher)
api.put('/enrollStudent/:id',[validateJwt], enrollStudent)
api.put('/editCourse/:id',[validateJwt], editCourse)
api.delete('/courseDelete/:id',[validateJwt], courseDelete)
api.get('/studentCourses/:id',[validateJwt], studendCourses)
api.get('/getCourses', [validateJwt] ,getCourses)

export default api

