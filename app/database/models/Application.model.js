import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userTechSkills: {
        type: [String],
        required: true
    },
    userSoftSkills: {
        type: [String],
        required: true
    },
    // userResume ( must be pdf , upload this pdf on cloudinary )
    userResume: {
        type: String,
        required: true
    },
})

applicationSchema.post("save", (docs) => {
    // console.log(docs);  
    docs.userResume = 'https://res.cloudinary.com/dcy8i3gle/image/upload/v1721219867/' + docs.userResume
})

export const applicationModel = mongoose.model('Application', applicationSchema)