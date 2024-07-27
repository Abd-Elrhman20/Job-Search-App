import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema({
    // like NodeJs back-end developer 
    jobTitle: {
        type: String,
        required: true
    },
    jobLocation: {
        type: String,
        enum: ['Remote', 'Onsite', 'Hybrid'],
        required: true,
        // default: 'Onsite'
    },
    workingTime: {
        type: String,
        enum: ['Full-time', 'Part-time'],
        required: true,
        // default: 'Full-time'
    },
    seniorityLevel: {
        type: String,
        enum: ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'],
        required: true,
        // default: 'Mid-Level'
    },
    // like  nodejs  , typescript ,…
    technicalSkills: {
        type: [String],
        required: true
    },
    //  like time management , team worker,..
    softSkills: {
        type: [String],
        required: true
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

})

export const jobModel = mongoose.model('Job', jobSchema)