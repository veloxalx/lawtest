import { Schema, model, models } from 'mongoose';

const LawyerSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    lawyerName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    nic: {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true
    },
    experienceYears: {
        type: Number,
        required: true
    },
    certificate: {
        type: String, 
        required: true
    },
    prevExperiences: {
        type: [String], 
        required: false
    },
    experience: {
        type: String,
        required: true
    },
    profilePic: {
        type: String, 
        required: false
    },
    contactNo: {
        type: String,
        required: true
    }
});

const Lawyer = mongoose.model('Lawyer', LawyerSchema);

module.exports = Lawyer;
