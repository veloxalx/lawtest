<<<<<<< HEAD
import Lawyer from '../../models/lawyer'
import { connectionDB } from '../../utils/db';
import { NextResponse } from 'next/server';
=======
import Lawyer from '@/app/models/lawyer';
import { connectionDB } from '@/app/utils/db';
>>>>>>> a404b0409fce8ea0122ff6135315fa97f163eb38

export async function GET(request) {
  try {
    await connectionDB();
    const lawyers = await Lawyer.find({});
    return NextResponse.json(lawyers, { status: 200 });
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    return NextResponse.json({ error: "Failed to fetch lawyer details" }, { status: 500 });
  }
}