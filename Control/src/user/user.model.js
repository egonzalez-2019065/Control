import mongoose, { model } from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    surname: {
        type: String, 
        required: true 
    },
    username: {
        type: String, 
        unique: true,
        lowercase: true,
        requerid: true
    },
    password: {
        type: String, 
        requerid: true
    },
    email: {
        type: String,
        requerid: true
    },
    phone: {
        type: String, 
        minLength: 8, 
        maxLength: 8, 
        requerid: true
    },
    role: {
        type: String, 
        uppercase: true, 
        enum: ['TEACHER', 'STUDENT'],
        required: true
    },
    courses: {
        type: Number,
        requerid: true
    }
},{
    versionKey: false
})

export default model('User', userSchema)

