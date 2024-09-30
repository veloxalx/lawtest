import { NextResponse } from 'next/server';
import Lawyer from '@/app/models/lawyer';
import { connectionDB } from '@/app/utils/db';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    await connectionDB();

    const formData = await request.formData();
    const lawyerName = formData.get('lawyerName');
    const age = Number(formData.get('age'));
    const nic = formData.get('nic');
    const university = formData.get('university');
    const experienceYears = Number(formData.get('experienceYears'));
    const contactNo = formData.get('contactNo');
    const certificate = formData.get('certificate');
    const myCategory = formData.get('myCategory');

    if (!lawyerName || !age || !nic || !university || !experienceYears || !contactNo || !certificate || !myCategory) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bytes = await certificate.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}_${certificate.name}`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
    await writeFile(filePath, buffer);

    const newLawyer = new Lawyer({
      lawyerName,
      age,
      nic,
      university,
      myCategory,
      experienceYears,
      certificatePath: `/uploads/${fileName}`,
      contactNo,
    });

    await newLawyer.save();
    return NextResponse.json(newLawyer, { status: 201 });
  } catch (error) {
    console.error("Error creating new lawyer:", error);
    return NextResponse.json({ error: "Failed to create a new lawyer profile" }, { status: 500 });
  }
}