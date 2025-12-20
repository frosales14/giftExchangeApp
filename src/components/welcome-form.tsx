'use client'

import { useActionState } from 'react'
import { updateProfile } from '@/app/[locale]/welcome/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'

const initialState = {
    error: '',
}

export function WelcomeForm() {
    const [state, formAction] = useActionState(updateProfile, initialState)
    const t = useTranslations('Welcome');

    return (
        <form action={formAction} className="space-y-4" suppressHydrationWarning>
            <div className="space-y-2">
                <Label htmlFor="fullName">{t('fullName')}</Label>
                <Input id="fullName" name="fullName" required placeholder={t('placeholder')} />
            </div>
            {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
            <Button type="submit" className="w-full">{t('getStarted')}</Button>
        </form>
    )
}
