import mongoose, { Schema } from "mongoose";

const employeeRangeValidator = (value) => {
    const regex = /^\d+-\d+$|^\d+\+$/;
    return regex.test(value);
};

const companySchema = new Schema({
    companyName: {
        type: String,
        required: true,
        unique: true
    },
    // Like what are the actual activities and services provided by the company ?
    description: {
        type: String,
        required: true
    },
    // industry ( Like Mental Health care )
    industry: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    // add numberOfEmployees ( must be range such as 11-20 employee)
    numberOfEmployees: {
        type: String,
        validate: {
            validator: employeeRangeValidator,
            message: props => `${props.value} is not a valid range format!`
        },
        required: true
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true
    },
    companyHR: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export const companyModel = mongoose.model('company', companySchema)
