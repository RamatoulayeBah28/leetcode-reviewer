import { clerkMiddleware } from '@clerk/nextjs/server'

// Next.js 16 renamed "Middleware" to "Proxy" -- same clerkMiddleware()
// function, just lives in proxy.ts instead of the old middleware.ts.
export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
