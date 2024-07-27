import { jobModel } from './../../database/models/Job.model.js';
import { applicationModel } from './../../database/models/Application.model.js';
import { AppError, catchAsyncError } from '../../utils/error.js';
import { transporter } from '../../utils/mail.js';
import { userModel } from './../../database/models/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//  register is a function do create a new document for each user in user collection in database 
export const register = catchAsyncError(async (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 4)
    req.body.password = hashedPassword
    const username = req.body.firstName + " " + req.body.lastName
    req.body.username = username

    await userModel.create(req.body)
        .then(user => {
            res.status(201).json({ status: 'success registration', user: user })
        })
        .catch(err => {
            // res.status(400).json({ status: 'fail', message: err.message })
            throw new AppError(err.message, 400)
        })
})
// login is a function to check if the user is exist [by user email or mobileNumber or recoveryEmail] in the database or not , if yes it's check the password if it's correct or not , if yes it's return the user data and token to the user
export const login = catchAsyncError(async (req, res) => {
    const user = await userModel.findOne({
        $or: [
            { email: req.body.email },
            { recoveryEmail: req.body.recoveryEmail },
            { mobileNumber: req.body.mobileNumber },
        ]
    })
    // .then(user => {
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            // update user status to online
            await userModel.findByIdAndUpdate(user._id, { status: 'online' })
                .then(user => {
                    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, recoveryEmail: user.recoveryEmail, mobileNumber: user.mobileNumber, role: user.role }, process.env.JWT_SECRET)
                    res.status(201).json({ status: 'success login', user: user, token: token })
                })
                .catch(err => {
                    throw new AppError(err.message, 400)
                })
        }
        else {
            throw new AppError("Invalid credentials")
        }
    }
    // })
    // .catch (err => {
    if (!user) {
        throw new AppError("User not found", 404)
    }
    // // res.status(400).json({ status: 'fail', message: err.message })
    // throw new AppError(err.message, 400)
    // })
})
// updateUser is a function to update a specific user data in the database
export const updateUser = catchAsyncError(async (req, res) => {
    await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(user => {
            res.status(201).json({ status: 'success update', user: user })
        })
        .catch(err => {
            // res.status(400).json({ status: 'fail', message: err.message })
            throw new AppError(err.message, 400)
        })
})
/*
    deleteUser is a function to check if user's role is User or Company_HR , 
    if it's User it's it find allApplications for a specific user 
        if there is Applications so it iterates over them to delete them and then delete the owner of them which is the user.
        ---------------
        if there is no Applications so it's delete the user only
    ____________________________________________________________
    if it's Company_HR it's it find jobs added by the userHR 
        if there is jobs so it iterates over them to delete them and check 
            if there is Applications for these jobs
                then finds all Applications for these jobs , then iterates over them to delete them and then delete the userHR.
            ---------------
            if there is no Applications for these jobs
                then delete the userHR only
        ------------------------------
        if there is no jobs so it's delete the userHR only
*/
export const deleteUser = catchAsyncError(async (req, res) => {
    const user = req.user
    if (user.role == "User") {
        const applications = await applicationModel.find({ userId: user.id })
        if (applications.length > 0) {
            applications.forEach(async (application) => {
                await applicationModel.findByIdAndDelete(application._id)
                    .then(async () => {
                        await userModel.findByIdAndDelete(user.id)
                            .then(() => {
                                res.status(200).json({ status: 'success', message: 'User Deleted and his related Application' })
                            })
                            .catch(err => { throw new AppError(err.message, 400) })
                    })
            })
            // .catch(err => { throw new AppError(err.message, 400) })
        }
        else {
            // delete user
            await userModel.findByIdAndDelete(user.id)
                .then(() => {
                    res.status(200).json({ status: 'success', message: 'User Deleted' })
                })
                .catch(err => { throw new AppError(err.message, 400) })
        }

    }
    if (user.role == "Company_HR") {
        await jobModel.find({ addedBy: user.id })
            .then(async (jobs) => {
                if (jobs.length > 0) {
                    // delete all jobs added by userHR
                    jobs.forEach(async (job) => {
                        await jobModel.findByIdAndDelete(job._id)
                            .then(async () => {
                                await applicationModel.find({ jobId: job.id })
                                    .then(async (applications) => {
                                        if (applications.length > 0) {
                                            applications.forEach(async (application) => {
                                                await applicationModel.findByIdAndDelete(application._id)
                                                    .then(async () => {
                                                        await userModel.findByIdAndDelete(user.id)
                                                            .then(() => {
                                                                res.status(200).json({ status: 'success', message: 'User (Hr) Deleted and his related Posted Jobs and Applications to this Jobs ' })
                                                            })
                                                            .catch(err => { throw new AppError(err.message, 400) })
                                                    })
                                                    .catch(err => { throw new AppError(err.message, 400) })
                                            })
                                        }
                                        else {
                                            // delete userHR
                                            await userModel.findByIdAndDelete(user.id)
                                                .then(() => {
                                                    res.status(200).json({ status: 'success', message: 'User (Hr) Deleted' })
                                                })
                                                .catch(err => { throw new AppError(err.message, 400) })
                                        }
                                    })
                                    .catch(err => { throw new AppError(err.message, 400) })
                                // await userModel.findByIdAndDelete(user.id)
                                //     .then(() => {
                                //         res.status(200).json({ status: 'success', message: 'User (Hr) Deleted and his related Posted Jobs and Applications to this Jobs ' })
                                //     })
                                //     .catch(err => { throw new AppError(err.message, 400) })
                            })
                            .catch(err => { throw new AppError(err.message, 400) })
                    })
                }
                else {
                    // delete userHR
                    await userModel.findByIdAndDelete(user.id)
                        .then(() => {
                            res.status(200).json({ status: 'success', message: 'User (Hr) Deleted' })
                        })
                        .catch(err => { throw new AppError(err.message, 400) })
                }
            })
            .catch(err => { throw new AppError(err.message, 400) })
    }
})
// getUser is a function to get a specific user document in the database
export const getUser = catchAsyncError(async (req, res) => {
    await userModel.findById(req.params.id)
        .then(user => {
            res.status(200).json({ status: 'success', user: user })
        })
        .catch(err => {
            // res.status(400).json({ status: 'fail', message: err.message })
            throw new AppError(err.message, 400)
        })
})
// getProfile is a function to get a specific user document in the database , token is't required to get the user data (xxxxx)
export const getProfile = catchAsyncError(async (req, res) => {
    await userModel.findById(req.params.userID)
        .then(user => {
            res.status(200).json({ status: 'success', user: user })
        })
        .catch(err => {
            // res.status(400).json({ status: 'fail', message: err.message })
            throw new AppError(err.message, 400)
        })
})

// updatePassword is a function that find user [with email or mobileNumber] and update it's password by the value coming from req.password
export const updatePassword = catchAsyncError(async (req, res) => {
    const { email, mobileNumber, password } = req.user
    await userModel.findOneAndUpdate({
        $or: [
            { email: email },
            { mobileNumber: mobileNumber },
        ]
    },
        { password: password })
        .then(response => {
            res.status(200).send({ message: "Password Updated" })
        })
        .catch(error => {
            throw new AppError(error.message, 400)
        })
})

/*
    forgetPassword is a function that find user [with email or mobileNumber] and send an email [ has a token at it's Url , token has the newPassword value ] to the user
    on url (http://localhost:3000/users/update-password/) to fire updatePassword Controller to reset his password
 */
export const forgetPassword = catchAsyncError(async (req, res) => {
    const newPassword = bcrypt.hashSync(req.body.password, 4)
    await userModel.findOne({
        $or: [
            { email: req.body.email },
            { mobileNumber: req.body.mobileNumber },
        ]
    }).then(async (user) => {
        if (user) {
            const token = jwt.sign({ email: user.email, mobileNumber: user.mobileNumber, password: newPassword }, process.env.JWT_SECRET_2)
            await transporter.sendMail({
                to: user.email,
                subject: "Rest Your Password",
                html: `<a href="http://localhost:3000/users/update-password/${token}">Click here to Rest your Password</a>`
            })
        } else {
            throw new AppError("User not found", 404)
        }
    }).catch(error => {
        throw new AppError(error.message, 400)
    })

    res.status(200).send({ message: "Email sent" })
})
// getAccountsAssociatedToSpecificRecoveryEmail is a function to get all users associated to a specific recovery Email
export const getAccountsAssociatedToSpecificRecoveryEmail = catchAsyncError(async (req, res) => {
    await userModel.find({ recoveryEmail: req.body.recoveryEmail })
        .then(users => {
            res.status(200).json({ status: 'success', users: users })
        })
        .catch(err => {
            // res.status(400).json({ status: 'fail', message: err.message })
            throw new AppError(err.message, 400)
        })
})
