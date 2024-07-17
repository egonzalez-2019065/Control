//Conexión a la base de datos 
'use strict'

import mongoose from 'mongoose'

export const connect = async() => {
    try{
        mongoose.connection.on('error', () =>{
            console.log('MongoDB | Could not be connect to mongoDB')
            mongoose.disconect()
        })
        mongoose.connection.on('connecting', () =>{
            console.log('MongoDB | Try connecting to mongoDB')
        })
        mongoose.connection.on('connected', () =>{
            console.log('MongoDB | connected to mongoDB')
        })
        mongoose.connection.on('open', () =>{
            console.log('MongoDB | connected to database')
        })
        mongoose.connection.on('reconected', () =>{
            console.log('MongoDB | reconected to mongoDB')
        })
        mongoose.connection.on('disconected', () =>{
            console.log('MongoDB | disconnected')
        })
        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeOutMS: 5000,
            maxPoolSize: 50
        })
    }catch(err){
        console.error(err)
    }
}