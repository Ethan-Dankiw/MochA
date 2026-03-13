import { NextResponse } from 'next/server';
import {getProblems} from "@/lib/db";

export async function GET() {
  const problems = await getProblems(5);
  return NextResponse.json(problems);
}