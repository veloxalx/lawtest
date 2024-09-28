import Lawyer from '@/app/models/lawyer';
import { connectionDB } from '@/app/utils/db';

export const GET=async(request)=>{
    try{
        await connectionDB();
        const lawyers = await Lawyer.find({}); 
        return new Response(JSON.stringify(lawyers), { status: 200 });
    } catch (error) {
      return new Response("Failed to fetch lawyer  details", {
        status: 500,
      });
    }
}