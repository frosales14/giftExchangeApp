import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export async function middleware(request: NextRequest) {
    const handleI18nRouting = createMiddleware(routing);
    const response = handleI18nRouting(request);

    // Run Supabase Middleware to update session, passing the intl response
    // so that cookies are set on the correct response object.
    const finalResponse = await updateSession(request, response);
    return finalResponse;
}

export const config = {
    matcher: [
        '/',
        '/(en|es)/:path*',
        // Enable redirects that add locale?
        // match all pathnames except for
        // - … if they start with `/api`, `/_next` or `/_vercel`
        // - … the ones containing a dot (e.g. `favicon.ico`)
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
}
