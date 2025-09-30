import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    // Simple secret verification
    if (authHeader !== `Bearer ${process.env.REVALIDATION_SECRET}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { path, tag } = body

    // Revalidate by path or tag
    if (path) {
      revalidatePath(path)
      console.log(`✅ Revalidated path: ${path}`)
    }
    
    if (tag) {
      revalidateTag(tag)
      console.log(`✅ Revalidated tag: ${tag}`)
    }

    // Always revalidate critical paths when tricks change
    revalidatePath('/tricks')
    revalidatePath('/')
    revalidatePath('/trick/[slug]', 'page')

    return NextResponse.json({ 
      revalidated: true, 
      path: path || 'all',
      now: Date.now() 
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json({ 
      message: 'Error revalidating', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}