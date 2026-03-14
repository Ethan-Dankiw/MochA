import { NextResponse } from 'next/server';
import {getProblemsByDifficulty} from "@/lib/database/query";

export async function GET() {
  // Get all the easy problems
  const problems = await getProblemsByDifficulty("Easy");
  return NextResponse.json(problems);
}