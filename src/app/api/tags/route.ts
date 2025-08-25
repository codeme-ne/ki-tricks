import { NextResponse } from 'next/server'

// Legacy tags API removed; return empty arrays
export async function GET() {
  return NextResponse.json({ departments: [], industries: [], success: true })
}