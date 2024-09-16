import Lawyer from "@models/lawyer";
import { connectionDB } from "@utils/db";
import { stringify } from "postcss";

export const GET=async(request,{params})=>{
    try{
        await connectionDB();
        const lawyer=await Lawyer.findById(params.id).populate('creator')
        if(!lawyer){
            return new Response("No such lawyer found", {status:404})
        }
        return  new Response(JSON.lawyer.stringify, {status:200})
    }
    catch(error){
        return new Response("Error !", {status:500})

    }
}

