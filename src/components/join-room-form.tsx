'use client'

import { useActionState } from 'react'
import { joinRoom } from '@/app/[locale]/dashboard/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

const initialState = {
    error: '',
}

export function JoinRoomForm() {
    const [state, formAction] = useActionState(joinRoom, initialState)
    const t = useTranslations('Dashboard');

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('joinRoom')}</CardTitle>
                <CardDescription>Enter a Room ID to join.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="flex gap-2 items-start" suppressHydrationWarning>
                    <div className="flex-1 space-y-2">
                        <Input name="roomId" placeholder="UUID..." required />
                        {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
                    </div>
                    <Button type="submit">{t('join')}</Button>
                </form>
            </CardContent>
        </Card>
    )
}
