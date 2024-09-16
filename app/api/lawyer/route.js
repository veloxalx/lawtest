import Lawyer from "@models/lawyer";
import { connectionDB } from "@utils/db";

export const GET=async(request)=>{
    try{
        await connectionDB();
        const lawyer=Lawyer.find({}).populate('creator')
        return new Response(JSON.newLawyer.stringify(lawyer), { status: 201 });
    } catch (error) {
      return new Response("Failed to fetch lawyer  details", {
        status: 500,
      });
    }
}