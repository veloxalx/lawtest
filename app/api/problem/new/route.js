import AddProblem from "@/app/add/page";
import { connectionDB } from "@/app/utils/db";
export const POST = async (request) => {
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

  try {
    await connectionDB();
    const newProblem = new AddProblem({
      creator: title,
      location,
      problem,
      email,
      phone,
      category,
      found,
      urgent,
    });
    await newProblem.save();
    return new Response(JSON.newProblem.stringify(newProblem), { status: 200 });
  } catch (error) {
    return new Response("Problem adding failed", { status: 500 });
  }
};
