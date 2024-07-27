import { AppError, catchAsyncError } from '../../../utils/error.js'
import joi from 'joi';

export const addJobSchema = joi.object({
    jobTitle: joi.string().required(),
    jobLocation: joi.string().valid('Remote', 'Onsite', 'Hybrid').required(),
    workingTime: joi.string().valid('Full-time', 'Part-time').required(),
    seniorityLevel: joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').required(),
    technicalSkills: joi.array().items(joi.string()).required(),
    softSkills: joi.array().items(joi.string()).required(),
    addedBy: joi.string().required(),
})

export const updateJobSchema = joi.object({
    jobTitle: joi.string(),
    jobLocation: joi.string().valid('Remote', 'Onsite', 'Hybrid'),
    workingTime: joi.string().valid('Full-time', 'Part-time'),
    seniorityLevel: joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
    addedBy: joi.string(),
})

export const addApplicationSchema = joi.object({
    // jobId : joi.string().required(),  // added in controller
    // userId : joi.string().required(),    // added in controller
    userTechSkills: joi.array().items(joi.string()).required(),
    userSoftSkills: joi.array().items(joi.string()).required(),
    // userResume: joi.string().required(),  // added in controller
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