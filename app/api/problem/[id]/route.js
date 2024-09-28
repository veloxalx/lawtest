import AddProblem from "@/app/add/page";
import { connectionDB } from "@/app/utils/db";

export const GET=async(request,{params})=>{
    try{
        await connectionDB();
        const problem=Problem.findById(params.id).populate('creator');
        if(!problem){
            return new Response("problem can't find",{status:404});
        }
        return new Response(JSON.stringify(problem),{status:200});
    }catch(error){
        return new Response("Problem fetching failed",{status:500});

    }
}

export const PATCH=async(request,{params})=>{
    const {
        title,
        location,
        problem,
        email,
        phone,
        category,
        userId,
        found,
        urgent,
      } = await request.JSON();
    try{
        await connectionDB();
        const existproblem=Problem.findById(params.id)
        if(!existproblem){
            return new Response("problem can't find",{status:404});
        }
        existproblem.title=title,
        existproblem.location=location,
        existproblem.problem=problem,
        existproblem.email=email,
        existproblem.phone=phone,
        existproblem.category=category,
        existproblem.found=found,
        existproblem.urgent=urgent,

        existproblem.save();
        return new Response("Problem update successfully",{status:200});
    }catch(error){
        return new Response("Problem update failed",{status:500});

    }
}
export const DELETE=async(request,{params})=>{
    try{
        await connectionDB();
        const problem=Problem.findByIdAndRemove(params.id)
    
        return new Response("Problem Deleted successfully",{status:200});
    }catch(error){
        return new Response("Problem Deleted failed",{status:500});

    }
}