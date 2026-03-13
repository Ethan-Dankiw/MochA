import { getProblems } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function GET() {
  const problems = await getProblems(5);
  return NextResponse.json(problems);
}