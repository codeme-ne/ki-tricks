import { NextResponse } from 'next/server'

export async function GET() {
  // Tags removed - department and industry tags no longer used
  return NextResponse.json({
    success: true,
    message: 'Tags endpoint deprecated - department and industry tags removed'
  })
}