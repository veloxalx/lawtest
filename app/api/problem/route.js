import AddProblem from "@/app/add/page";
import { connectionDB } from "@/app/utils/db";

export const GET=async(request)=>{
    try{
        await connectionDB();
        const problem=AddProblem.find({}).populate('creator')
        return new Response(JSON.stringify(problem), {status:200})
    }
    catch(error){
        return new Response("Fetching Problems Failed", {status:500})
    }
}