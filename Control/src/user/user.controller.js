'use strict'

import User from './user.model.js'
import {encrypt, checkPassword, checkUpdate} from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res) =>{
    console.log('test is running')
    res.send({message: 'test user is running'})
}

export const registerStudent = async(req, res) => {
    try{
        // Capturar la información 
        let data = req.body
        // Encriptar la contraseña 
        data.password = await encrypt(data.password)
        // Asignar el rol por defecto e iniciar el contador 
        data.role = 'STUDENT'
        data.courses = 0;
        // Guardar la información 
        let user = new User(data) 
        await user.save()
        // Responder al usuario 
        return res.send({message: `Registered successfully, can be logged with user ${user.username}`})
    }catch(err){
        console.log(err)
        return res.status(500).send({message: 'Error registering user'})
    }
}

export const registerTeacher = async(req, res) => {
    try{
        // Capturar la información 
        let data = req.body
        // Encriptar la contraseña 
        data.password = await encrypt(data.password)
        // Asignar el rol por defecto 
        data.role = 'TEACHER'
        // Guardar la información 
        let user = new User(data) 
        await user.save()
        // Responder al usuario 
        return res.send({message: `Registered successfully, can be logged with user ${user.username}`})
    }catch(err){
        console.log(err)
        return res.status(500).send({message: 'Error registering user'})
    }
}

// Profesor por defecto
const defaultTeacher = {
    name: 'Francisco',
    surname: 'Noj',
    username: 'fnoj',
    password: 'fnoj123',
    email: 'fnoj@gmail.com',
    phone: '40009000',
    role: 'TEACHER'
}

// Inserción de datos 
export const insertDefault = async(req, res) =>{
    try{
        //Un único teacher por defecto
        const oneTeacher = await User.findOne({username: defaultTeacher.username})
        if(oneTeacher){
            console.log('This teacher alread exists')
        }else{
            //Encryptar la contraseña
            defaultTeacher.password = await encrypt(defaultTeacher.password)
            //Crear el nuevo teacher
            const newTeacher = await User.create(defaultTeacher)
            //Responder al usuario
            console.log(`A deafult teacher is create, can be logged with user: ${newTeacher.username}`)
        }
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user'})
    }
}

export const login = async(req, res) => {
    try{
        // Capturar los datos del body
        let { username, password } = req.body 
        // Validar que el usuario exista 
        let user = await User.findOne({username})
        // Verifico que la contraseña coincida 
        if(user && await checkPassword(password, user.password)){
            let loggedUser = { 
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            //Generar el token 
            let token = await generateJwt(loggedUser)
            // Responde al usuario
            return res.send({message: `Welcome ${user.name}`, loggedUser, token})
        }
        return res.status(404).send({message: 'Invalid Credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

export const updateUser = async(req, res) =>{
    // Obtener el id a actualizar 
    let { id } = req.params
    // Párametros a actualizar 
    let data = req.body
    // Encriptar la nueva contraseña si existe 
    if (data.password) {
        data.password = await encrypt(data.password);
    } 
    // Traer el token
    const token  = req.user;
    // Validar si trae datos
    let update = checkUpdate(data, token)
    if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be update'})
    //Actualizar 
    let updateUser = await User.findOneAndUpdate(
        {_id: id }, 
        data, 
        {new:true} 
    )
    //Validar si se actualizó 
    if(!updateUser) return res.status(404).send({message: 'User not found and not update'})
    // Responder
    return res.send({message: 'Update user', updateUser})
}

export const deleteUser = async(req, res) => {
    try{
        // Obtener el Id 
        let { id } = req.params 
        //Validar si está logueado y es el mismo 
        // Se hace desde validate-jwt.js
        let deletedUser = await User.findOneAndDelete({_id: id})
        // Verificar que si elimina 
        if(!deletedUser) return res.status(404).send({message: 'Account not found and not deleted'})
        // Responder 
        return res.send({message: `Account with username ${deletedUser.username} deleted successfully`})
    }catch(err){
        console.log(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}