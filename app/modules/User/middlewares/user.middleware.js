import { AppError, catchAsyncError } from '../../../utils/error.js';
import { userModel } from './../../../database/models/User.model.js';
import jwt from 'jsonwebtoken'

export const checkExistedEmail = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;
    await userModel.findOne({ email })
        .then(user => {
            if (user) {
                // res.status(400).json('Email already exists');
                // throw new AppError('Email already exists', 400);
                next(new AppError('Email already exists', 400))
            } else {
                next();
            }
        })
        .catch(err => {
            // res.status(500).json(err);
            // throw new AppError(err.message, 500);
            next(new AppError(err.message, 500))
        })
})

export const checkExistedMobileNumber = catchAsyncError(async (req, res, next) => {
    const { mobileNumber } = req.body;
    await userModel.findOne({ mobileNumber })
        .then(user => {
            if (user) {
                // res.status(400).json('mobileNumber already exists');
                // throw new AppError('mobileNumber already exists', 400);
                next(new AppError('mobileNumber already exists', 400))
            } else {
                next();
            }
        })
        .catch(err => {
            // res.status(500).json(err);
            // throw new AppError(err.message, 500);
            next(new AppError(err.message, 400))
        })
})

export const checkExistedUserName = catchAsyncError(async (req, res, next) => {
    const { firstName, lastName } = req.body;

    await userModel.findOne({ username: (firstName + " " + lastName) })
        .then(user => {
            if (user) {
                // res.status(400).json('mobileNumber already exists');
                // throw new AppError('mobileNumber already exists', 400);
                next(new AppError('UserName already exists , please change your firstName or lastName', 400))
            } else {
                next();
            }
        })
        .catch(err => {
            // res.status(500).json(err);
            // throw new AppError(err.message, 500);
            next(new AppError(err.message, 400))
        })
})

export const checkExistedEmailAndPhoneNumber = catchAsyncError(async (req, res, next) => {
    const { email, mobileNumber } = req.body;
    if (email) {
        await userModel.findOne({ email })
            .then(user => {
                if (user) {
                    // throw new AppError('Email already exists', 400);
                    next(new AppError('Email already exists', 400))
                }
            })
    }
    if (mobileNumber) {
        await userModel.findOne({ mobileNumber })
            .then(user => {
                if (user) {
                    // throw new AppError('mobileNumber already exists', 400);
                    next(new AppError('mobileNumber already exists', 400))
                }
            })
    }
    next();
})
// checkExistedTokenAndUser to check token and role to be "User" 
export const checkExistedTokenAndUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.headers
    // jwt.verify(token, "secret_exam", (err, decoded) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                // res.status(401).json('Unauthorized');
                // throw new AppError('Invalid Token', 498);
                next(new AppError('Invalid Token', 498))
            } else {
            if (decoded.id === req.params.id) {
                req.user = decoded;
                next();
            }
            else {
                // throw new AppError('Unauthorized', 401);
                next(new AppError('Unauthorized', 401))
            }
        }
    })
})
// checkTokenForEmail to check token but it's for email that sent to user to reset password
export const checkTokenForEmail = catchAsyncError(async (req, res, next) => {
    const { token } = req.params
    jwt.verify(token, process.env.JWT_SECRET_2, (err, decoded) => {
        if (err) {
            // res.status(401).json('Unauthorized');
            // throw new AppError('Invalid Token', 498);
            next(new AppError('Invalid Token', 498))
        }
        else {
            req.user = decoded;
            next();
        }
    })
})