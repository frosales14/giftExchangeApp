'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function GoogleSignInButton() {
    const handleLogin = async () => {
        const supabase = createClient()
        const origin = window.location.origin
        const redirectUrl = `${origin}/auth/callback`

        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
            },
        })
    }

    return (
        <Button onClick={handleLogin} variant="secondary" className="w-full" type="button">
            Sign in with Google
        </Button>
    )
}
