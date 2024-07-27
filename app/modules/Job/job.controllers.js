import { jobModel } from './../../database/models/Job.model.js';
import { AppError, catchAsyncError } from "../../utils/error.js";
import { companyModel } from '../../database/models/Company.model.js';
import { applicationModel } from '../../database/models/Application.model.js';
import cloudinary from '../../utils/cloudinary.js';

// addJob is a function used to create a job document in database
export const addJob = catchAsyncError(async (req, res, next) => {
    await jobModel.create(req.body)
        .then((job) => {
            res.status(201).json({ status: 'success creation', job: job })
        })
        .catch((err) => {
            throw new AppError(err.message, 400)
        })
})
// updateJob is a function used to modify a specific job document in database
export const updateJob = catchAsyncError(async (req, res, next) => {
    await jobModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then((job) => {
            res.status(201).json({ status: 'success updating', updatedJob: job })
        })
        .catch((err) => {
            throw new AppError(err.message, 400)
        })
})
// updateJob is a function used to find and delete a specific job document in database then in success case it deletes all applications related to this job
export const deleteJob = catchAsyncError(async (req, res, next) => {
    await jobModel.findOneAndDelete({ _id: req.params.id })
        .then(async (job) => {
            await applicationModel.deleteMany({ jobId: job._id })
                .then((applications) => {
                    res.status(201).json({ status: 'success deleting', deletedJob: job, deletedApplications: applications })
                })
                .catch((err) => {
                    throw new AppError(err.message, 400)
                })
        })
        .catch((err) => {
            throw new AppError(err.message, 400)
        })
})
// getAllJobsWithCompany is a function used to get all jobs then iterate over them to get the company related to each job
export const getAllJobsWithCompany = catchAsyncError(async (req, res) => {
    let jobsAndCompanies = []

    const jobs = await jobModel.find()
    if (jobs) {
        for (const job of jobs) {
            const company = await companyModel.find({ companyHR: job.addedBy })
            jobsAndCompanies.push({ ["Job: " + job.jobTitle]: job, relatedCompany: company });
        }
        res.status(200).json({ status: 'success', data: jobsAndCompanies })
    }
    else {
        throw new AppError('No Jobs Found', 404)
    }
})
// getAllJobsForSpecificCompany is a function used to find specific company then get all jobs related to this company
export const getAllJobsForSpecificCompany = catchAsyncError(async (req, res) => {
    const { companyName } = req.query
    const companies = await companyModel.find({ companyName: companyName })
    if (companies) {
        await jobModel.find({ addedBy: companies[0].companyHR })
            .then((jobs) => {
                res.status(200).json({ status: 'success', relatedJobs: jobs })
            })
            .catch((err) => {
                throw new AppError(err.message, 400)
            })
    } else {
        throw new AppError('No Companies Found', 404)
    }
})
// getAllJobsWithFilters is a function used to save the filters in an array then iterate over them to get the jobs related to these filters
export const getAllJobsWithFilters = catchAsyncError(async (req, res) => {
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query
    const filters = [workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills]
    const filtrationArray = []

    for (let i = 0; i < filters.length; i++) {
        if (filters[i] !== undefined) {
            filtrationArray.push(filters[i])
        }
    }

    if (filtrationArray.length > 0) {
        await jobModel.find({
            $or: [
                { workingTime: workingTime },
                { jobLocation: jobLocation },
                { seniorityLevel: seniorityLevel },
                { jobTitle: jobTitle },
                {
                    technicalSkills:
                        { $in: technicalSkills }
                }
            ]
        })
            .then((jobs) => {
                res.status(200).json({ status: 'success', filteredJobs: jobs })
            })
            .catch((err) => {
                throw new AppError(err.message, 400)
            })
    } else {
        throw new AppError('No Filters Provided', 400)
    }
})
/*
    applyToJob is a function used to check req.file if it's a pdf file and req.file passed from upload middleware then
    it apply to a specific job by creating an application document in database
*/
export const applyToJob = catchAsyncError(async (req, res) => {
    const body = {}
    const user = req.user
    body.userId = user.id
    body.jobId = req.params.id
    body.userResume = req.file.filename + '.pdf'
    const { userTechSkills, userSoftSkills } = req.body
    body.userTechSkills = userTechSkills
    body.userSoftSkills = userSoftSkills

    // console.log(req.body);
    // console.log(req.file);
    // console.log(body);

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    } else {
        await applicationModel.create(body)
            .then(async (application) => {
                res.status(201).json({ status: 'success applying', ApplyingUser: user, application: application })
            })
            .catch((err) => {
                throw new AppError(err.message, 400)
            })
    }
    // res.status(200).send({
    //     message: 'File uploaded successfully.',
    //     file: req.file
    // });
})