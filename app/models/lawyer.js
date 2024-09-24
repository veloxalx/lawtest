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
        data: Buffer,
        contentType: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    prevExperiences: {
        type: [String],
        required: false
    },
    profilePic: {
        data: Buffer,
        contentType: String,
        required: false
    },
    contactNo: {
        type: String,
        required: true
    }
});

const Lawyer = models.Lawyer || model('Lawyer', LawyerSchema);
export default Lawyer;



// import { Schema, model, models } from 'mongoose';

// const LawyerSchema = new Schema({
//   creator: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//   },
//   lawyerName: {
//     type: String,
//     required: true,
//   },
//   age: {
//     type: Number,
//     required: true,
//   },
//   nic: {
//     type: String,
//     required: true,
//   },
//   university: {
//     type: String,
//     required: true,
//   },
//   experienceYears: {
//     type: Number,
//     required: true,
//   },
//   contactNo: {
//     type: String,
//     required: true,
//   },
// });

// const Lawyer = models.Lawyer || model('Lawyer', LawyerSchema);
// module.exports = Lawyer;
