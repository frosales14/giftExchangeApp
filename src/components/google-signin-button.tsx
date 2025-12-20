'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useTranslations, useLocale } from 'next-intl'

export function GoogleSignInButton() {
    const t = useTranslations('Auth');
    const locale = useLocale();
    const handleLogin = async () => {
        const supabase = createClient()
        const origin = window.location.origin
        const currentLocale = locale || 'en';
        const redirectUrl = `${origin}/${currentLocale}/auth/callback`

        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
            },
        })
    }

    return (
        <Button onClick={handleLogin} variant="secondary" className="w-full" type="button">
            {t('googleSignIn')}
        </Button>
    )
}
