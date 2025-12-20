'use client'

import { useActionState } from 'react'
import { startExchange } from '@/app/[locale]/rooms/[id]/actions'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

const initialState = {
    error: '',
}

export function StartExchangeButton({ roomId }: { roomId: string }) {
    const [state, formAction] = useActionState(startExchange.bind(null, roomId), initialState)
    const t = useTranslations('Room');

    return (
        <form action={formAction}>
            <Button size="lg" type="submit">{t('startExchange')} 🎲</Button>
            {state?.error && <p className="text-red-500 text-sm mt-2">{state.error}</p>}
        </form>
    )
}
