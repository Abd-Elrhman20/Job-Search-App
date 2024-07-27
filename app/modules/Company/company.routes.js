import { Router } from 'express';
import { createCompany, deleteCompany, getApplications, getCompanyData, getCompanyName, updateCompany } from './company.controllers.js';
import { addCompanySchema, updateCompanySchema, validate } from './middlewares/companyValidation.js';
import { checkExistedCompanyEmailAndCompanyNameAndHR, checkHRTokenAndRole, checkTokenForUser } from './middlewares/company.middleware.js';

const companyRouter = Router()
companyRouter.route('/applications').get(checkHRTokenAndRole, getApplications) // ? make sure it works fine after add jobs and applications
companyRouter.route('/find/:companyName').get(checkTokenForUser, getCompanyName)

companyRouter.route('/').post([validate(addCompanySchema), checkExistedCompanyEmailAndCompanyNameAndHR, checkHRTokenAndRole], createCompany)
companyRouter.route('/:id').put([validate(updateCompanySchema), checkExistedCompanyEmailAndCompanyNameAndHR, checkHRTokenAndRole], updateCompany)
.delete(checkHRTokenAndRole, deleteCompany)
.get(checkHRTokenAndRole, getCompanyData) 

export default companyRouter