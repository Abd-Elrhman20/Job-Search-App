import { AppError, catchAsyncError } from '../../../utils/error.js'
import joi from 'joi';

const pattern = /^01[0125][0-9]{8}$/
// const pattern = /^01[0125][0-9]{8}$/gm

export const registerSchema = joi.object({
    firstName: joi.string().min(3).max(10).required(),
    lastName: joi.string().min(3).max(10).required(),
    // username: joi.string().min(3).max(10).required().valid(joi.ref("firstName"), joi.ref("lastName")),
    // username: joi.string().min(6).max(20).required(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: joi.string().min(6).max(10).required(),
    recoveryEmail: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    DOB: joi.date().required(),
    mobileNumber: joi.string().required().regex(pattern),
    role: joi.string().valid('User', 'Company_HR').required(),
    status: joi.string().valid('online', 'offline').required(),
})

export const updateUserSchema = joi.object({
    firstName: joi.string().min(3).max(10),
    lastName: joi.string().min(3).max(10),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    recoveryEmail: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    mobileNumber: joi.string().regex(pattern),
    DOB: joi.date(),
})

export const updateRestPasswordSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    mobileNumber: joi.string().regex(pattern),
    password: joi.string().min(6).max(10).required(),
})

export const validate = (schema) => catchAsyncError(async (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
        // error.details.map((err) => res.status(400).json(err.message))
        error.details.map(async (err) => {
            // throw new AppError(err.message, 400);
            next(new AppError(err.message, 400))
        });
    } else {
        next();
    }
})