'use strict'

import { hash, compare } from 'bcrypt'



export const encrypt = async(password) => {
    try{
        return hash(password, 10) 
    }catch(err){
        console.error(err)
        return err
    }
}

// Validar la contraseña 
export const checkPassword = async (password, hash) => {
    try{
        return await compare(password, hash)
    }catch(err){
        console.error(err);
        return err
    }
}

export const checkUpdate = (data, token)=>{
    if(token.role === 'STUDENT'){
        if(Object.entries(data).length === 0 ||
            data.role ||
            data.role == '' 
        ) {
            return false
        }
        return true
    }else{
        if(Object.entries(data).length ===0){
            return false
        }
        return true
    }
}