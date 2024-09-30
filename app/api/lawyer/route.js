import Lawyer from '../../models/lawyer'
import { connectionDB } from '../../utils/db';
import { NextResponse } from 'next/server';

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