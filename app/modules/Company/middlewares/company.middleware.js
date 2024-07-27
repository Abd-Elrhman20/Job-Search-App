import { companyModel } from "../../../database/models/Company.model.js";
import { jobModel } from "../../../database/models/Job.model.js";
import { AppError, catchAsyncError } from "../../../utils/error.js";
import jwt from 'jsonwebtoken'

// checkExistedCompanyEmailAndCompanyNameAndHR is a middleware to check if the company email or company name or company HR is already exist in the database or not 
export const checkExistedCompanyEmailAndCompanyNameAndHR = catchAsyncError(async (req, res, next) => {
    const { companyEmail, companyName, companyHR } = req.body;
    if (companyEmail) {
        await companyModel.findOne({ companyEmail })
            .then(company => {
                if (company) {
                    // throw new AppError('This Company-Email already exists', 400);
                    next(new AppError('This Company-Email already exists', 400))
                }
            })
    }
    if (companyName) {
        await companyModel.findOne({ companyName })
            .then(company => {
                if (company) {
                    // throw new AppError('This Company-Name already exists', 400);
                    next(new AppError('This Company-Name already exists', 400))
                }
            })
    }
    if (companyHR) {
        await companyModel.findOne({ companyHR })
            .then(company => {
                if (company) {
                    // throw new AppError('This Company-HR already exists', 400);
                    next(new AppError('This Company-HR already exists', 400))
                }
            })
    }
    next();
})
// checkHRTokenAndRole is a middleware to check if the token is exist in the headers or not , if token valid or invalid , if yes it's check if the role of the user is Company_HR if yes 
// the function finds job that added by the same user (company_HR) if success it do a next function .
export const checkHRTokenAndRole = catchAsyncError(async (req, res, next) => {
    const { token } = req.headers;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                // throw new AppError('Invalid Token', 400);
                next(new AppError('Invalid Token', 400))
            }
            else {
                if (decoded.role === "Company_HR") {
                    await jobModel.findOne({ _id: req.params.id })
                        .then(job => {
                            if (decoded.id == job.addedBy) {
                                req.companyHR = decoded;
                                next();
                            }
                            else {
                                // throw new AppError('UnAuthorization', 400);
                                next(new AppError('UnAuthorized , You are not the Hr who posted this job', 400))
                            }
                        })
                        .catch(err => {
                            // throw new AppError(err.message, 400);
                            next(new AppError(err.message, 400))
                        })
                }
                else {
                    // throw new AppError('UnAuthorization', 400);
                    next(new AppError('UnAuthorization', 400))
                }
            }
        })
    }
    else {
        // throw new AppError('Token is required', 400);
        next(new AppError('Token is required', 400))
    }
})
// checkTokenForUser is a middleware to check if the token is valid or invalid , if valid it's return the user data to the user
export const checkTokenForUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.headers
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // res.status(401).json('Unauthorized');
            // throw new AppError('Invalid Token', 498);
            next(new AppError('Invalid Token', 400))
        }
        else {
            req.user = decoded;
            next();
        }
    })
})