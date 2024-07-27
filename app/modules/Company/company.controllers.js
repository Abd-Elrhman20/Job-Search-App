import { userModel } from './../../database/models/User.model.js';
import { applicationModel } from './../../database/models/Application.model.js';
import { jobModel } from './../../database/models/Job.model.js';
import { companyModel } from './../../database/models/Company.model.js';
import { AppError, catchAsyncError } from './../../utils/error.js';

// createCompany function is used to create a new company document in the companies collection database
export const createCompany = catchAsyncError(async (req, res) => {
    await companyModel.create(req.body)
        .then(company => {
            res.status(201).json({ status: 'success update', company: company })
        })
        .catch(err => {
            throw new AppError("Failed to create company", 400)
        })
})
// updateCompany function is used to update a company document in the companies collection database
export const updateCompany = catchAsyncError(async (req, res) => {
    await companyModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then(company => {
            res.status(201).json({ status: 'success update', updatedCompany: company })
        })
        .catch(err => {
            throw new AppError("Failed to update company", 400)
        })
})
// deleteCompany function is used to delete a company document in the companies collection database
export const deleteCompany = catchAsyncError(async (req, res) => {
    await companyModel.findOneAndDelete({ _id: req.params.id })
        .then(company => {
            res.status(201).json({ status: 'success delete', deletedCompany: company })
        })
        .catch(err => {
            throw new AppError(err, 400)
        })
})
// getCompanyData function is used to get a company document with jobs related to company
export const getCompanyData = catchAsyncError(async (req, res) => {
    const { id } = req.companyHR

    await companyModel.find({ _id: req.params.id })
        .then(async (company) => {
            await jobModel.find({ addedBy: id })
                .then(jobs => {
                    res.status(201).json({ status: 'success', company: company, jobs: jobs })
                })
                .catch(err => {
                    throw new AppError(err, 400)
                })
        })
        .catch(err => {
            throw new AppError(err, 400)
        })
})
// getCompanyName function is used to get a company document by company name
export const getCompanyName = catchAsyncError(async (req, res) => {
    await companyModel.find({ companyName: req.params.companyName }, {
        companyHR: 0,
        _id: 0,
        __v: 0
    })
        .then(company => {
            res.status(200).json({ status: 'founded', FoundedCompany: company })
        })
        .catch(err => {
            throw new AppError(err, 400)
        })
})
// getApplications function is used to get all jobs by company's HR if (addedBy) then iterate over all jobs and get all applications related to each job then iterate over all applications and get all users related to each application
export const getApplications = catchAsyncError(async (req, res) => {
    const { id } = req.companyHR;
    let allUsers = [];
    let allApplications = [];

    try {
        const jobs = await jobModel.find({ addedBy: id });
        for (const job of jobs) {
            const applications = await applicationModel.find({ jobId: job._id });
            allApplications.push(...applications);
            for (const application of applications) {
                const users = await userModel.find({ _id: application.userId });
                allUsers.push(...users);
            }
        }

        res.status(200).json({
            status: 'success',
            data: {
                users: allUsers,
                applications: allApplications
            }
        });
    } catch (err) {
        throw new AppError(err, 400);
    }
})