import mongoose from 'mongoose';

const LawyerSchema = new mongoose.Schema({
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
  certificatePath: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true
  }
});

const Lawyer = mongoose.models.Lawyer || mongoose.model('Lawyer', LawyerSchema);
export default Lawyer;