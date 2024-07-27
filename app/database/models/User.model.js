import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    recoveryEmail: {
        type: String,
        required: true
    },
    // add DOB (date of birth, must be date format 2023-12-4)
    DOB: {
        type: Date,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['User', 'Company_HR'],
        required: true,
        default: "User"
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        required: true,
        default: 'offline'
    }

})

export const userModel = mongoose.model('User', userSchema)