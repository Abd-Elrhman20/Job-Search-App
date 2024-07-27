import { checkUserTokenAndRoleToBeUser } from './middlewares/job.middleware.js';
import { checkHRTokenAndRole, checkTokenForUser } from './../Company/middlewares/company.middleware.js';
import { Router } from 'express';
import { addJob, deleteJob, getAllJobsWithCompany, getAllJobsForSpecificCompany, updateJob, getAllJobsWithFilters, applyToJob } from './job.controllers.js';
import { addApplicationSchema, addJobSchema, updateJobSchema, validate } from './middlewares/jobValidation.js';
import upload from '../../utils/upload.js';

const jobRouter = Router()

jobRouter.route('/').post([validate(addJobSchema), checkHRTokenAndRole], addJob)
    .get(checkTokenForUser, getAllJobsWithCompany)

jobRouter.route('/:id').put([validate(updateJobSchema), checkHRTokenAndRole], updateJob)
    .delete([checkHRTokenAndRole], deleteJob)

jobRouter.route('/company').get(checkTokenForUser, getAllJobsForSpecificCompany)
jobRouter.route('/filter').get(checkTokenForUser, getAllJobsWithFilters)

// Apply to Job
jobRouter.route('/apply/:id').post([checkUserTokenAndRoleToBeUser, upload.single('file')], applyToJob)

export default jobRouter