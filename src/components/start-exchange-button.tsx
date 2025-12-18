'use client'

import { useFormState } from 'react-dom'
import { startExchange } from '@/app/rooms/[id]/actions'
import { Button } from '@/components/ui/button'

const initialState = {
    error: '',
}

export function StartExchangeButton({ roomId }: { roomId: string }) {
    const [state, formAction] = useFormState(startExchange.bind(null, roomId), initialState)

    return (
        <form action={formAction}>
            <Button size="lg" type="submit">Start Exchange 🎲</Button>
            {state?.error && <p className="text-red-500 text-sm mt-2">{state.error}</p>}
        </form>
    )
}
