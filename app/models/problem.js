import mongoose, { Schema, model, models } from 'mongoose';

const ProblemSchema = new Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    problem: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    category: { type: String, required: true },
    urgent: { type: Boolean, default: false },
    found: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
  }, { timestamps: true });

const Problem=mongoose.model('problem',ProblemSchema)
module.exports=Problem