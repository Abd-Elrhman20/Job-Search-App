import { Router } from 'express'
import { checkTokenForUser } from './../Company/middlewares/company.middleware.js ';
import { deleteUser, forgetPassword, getAccountsAssociatedToSpecificRecoveryEmail, getProfile, getUser, login, register, updatePassword, updateUser } from './user.controllers.js'
import { registerSchema, updateRestPasswordSchema, updateUserSchema, validate } from './middlewares/userValidation.js';
import { checkExistedEmail, checkExistedEmailAndPhoneNumber, checkExistedMobileNumber, checkExistedTokenAndUser, checkExistedUserName, checkTokenForEmail } from './middlewares/user.middleware.js';

const userRouter = Router()

userRouter.route('/signup').post([validate(registerSchema), checkExistedEmail, checkExistedMobileNumber, checkExistedUserName], register)
userRouter.route('/signin').post(login)
userRouter.route('/:id').put([validate(updateUserSchema), checkExistedEmailAndPhoneNumber, checkExistedTokenAndUser], updateUser)
    .delete(checkExistedTokenAndUser, deleteUser)
    .get(checkExistedTokenAndUser, getUser)

userRouter.route('/profile/:userID').get(getProfile)   // !!!!
// // update password 
userRouter.route('/update-password/:token').get(checkTokenForEmail, updatePassword)  // we make the method to (get) because browser can't send a get requests only 
// // forget password
userRouter.route('/forget-password').post(validate(updateRestPasswordSchema), forgetPassword)
// // Get all accounts associated to a specific recovery Email
userRouter.route('/get-accounts').post(checkTokenForUser, getAccountsAssociatedToSpecificRecoveryEmail)

export default userRouter