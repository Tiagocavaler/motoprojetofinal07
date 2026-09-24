import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware liberado para TCC usando localStorage
// A proteção real do admin está dentro de app/(sistema)/admin/page.tsx
export function middleware(req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
};