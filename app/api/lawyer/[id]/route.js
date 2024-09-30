import Lawyer from '../../../models/lawyer'
import { connectionDB } from '@/app/utils/db';

export const GET=async(request,{params})=>{
    try{
        await connectionDB();
        const lawyer=await Lawyer.findById(params.id);
        if(!lawyer){
            return new Response("No such lawyer found", {status:404})
        }
        return  new Response(JSON.lawyer.stringify(lawyer), {status:200})
    }
    catch(error){
        return new Response("Error !", {status:500})

    }
}

export const PATCH=async(request,{params})=>{
    const {
        lawyerName,
        age,
        nic,
        university,
        experienceYears,
        certificate,
        prevExperiences,
        experience,
        profilePic,
        contactNo,
      } = await request.json();

    try{
        await connectionDB();
        const existlawyer=await Lawyer.findById(params.id);
        if(!lawyer){
            return new Response("No such lawyer found", {status:404})
        }
        existlawyer.lawyerName=lawyerName,
        existlawyer.age= age,
        existlawyer.nic= nic,
        existlawyer.university= university,
        existlawyer.experienceYears=experienceYears,
        existlawyer.certificate= certificate,
        existlawyer.prevExperiences= prevExperiences,
        existlawyer.experience=experience,
        existlawyer.profilePic=profilePic,
        existlawyer.contactNo=contactNo,

        existlawyer.save();
        return  new Response("Profile update successful", {status:200})
    }
    catch(error){
        return new Response("Error !", {status:500})

    }
}

export const DELETE=async(request,{params})=>{
try{
    await connectionDB();
    await Lawyer.findByIdAndRemove(params.id);

     return  new Response("Profile Delete successful", {status:200})
    }
    catch(error){
        return new Response("Error !", {status:500})

    }
}