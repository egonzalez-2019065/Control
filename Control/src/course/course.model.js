'use strict'

import mongoose, { model, Schema } from 'mongoose'

const courseSchema = mongoose.Schema({
    name: {
        type: String, 
        requerid: true
    },
    description: {
        type: String, 
        requerid: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "User",
        requerid: false
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }]
}, {
    versionKey: false
})


export default model('course', courseSchema)