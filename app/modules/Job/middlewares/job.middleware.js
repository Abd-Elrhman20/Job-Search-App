import jwt from 'jsonwebtoken';
import { AppError, catchAsyncError } from '../../../utils/error.js';
import { applicationModel } from '../../../database/models/Application.model.js';

/*
checkUserTokenAndRoleToBeUser is a middleware function that checks if the user token is valid and the user role is User if yes 
it finds all the applications of that user and check if the user has already applied for the job or not if yes it throws an error
if not it do next()
*/
export const checkUserTokenAndRoleToBeUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.headers;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                next(new AppError('Invalid Token', 400))
            }
            else {
                if (decoded.role === "User") {
                    const applications = await applicationModel.find({ userId: decoded.id })
                    // .then((applications) => {
                    if (applications.length > 0) {
                        applications.forEach((application) => {
                            if (application.jobId == req.params.id) {
                                next(new AppError('You Have Already Applied For This Job', 400))
                            }
                            else {
                                req.user = decoded;
                                next();
                            }
                        })
                    }
                    else {
                        req.user = decoded;
                        next();
                    }
                    // })
                }
                else {
                    throw new AppError("Your Can't Apply For a Job , You Are an Company_HR", 400);
                }
            }
        })
    }
    else {
        throw new AppError('Token is required', 400);
    }
})