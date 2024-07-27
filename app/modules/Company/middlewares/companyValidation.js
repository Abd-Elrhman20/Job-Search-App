import { AppError, catchAsyncError } from '../../../utils/error.js'
import joi from 'joi';

const regex = /^\d+-\d+$|^\d+\+$/;

export const addCompanySchema = joi.object({
    companyName: joi.string().required(),
    description: joi.string().min(4).max(150).required(),
    industry: joi.string().required(),
    address: joi.string().required(),
    numberOfEmployees: joi.string().pattern(regex).required(),
    companyEmail: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    companyHR: joi.string().required()
})

export const updateCompanySchema = joi.object({
    companyName: joi.string(),
    description: joi.string().min(4).max(150),
    industry: joi.string(),
    address: joi.string(),
    numberOfEmployees: joi.string().pattern(regex),
    companyEmail: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    companyHR: joi.string()
})

export const validate = (schema) => catchAsyncError(async (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
        // error.details.map((err) => res.status(400).json(err.message))
        error.details.map(async (err) => {
            // throw new AppError(err.message, 400);
            next(new AppError(err.message, 400));
        });
    } else {
        next();
    }
})