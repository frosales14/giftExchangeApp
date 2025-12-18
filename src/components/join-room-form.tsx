'use client'

import { useFormState } from 'react-dom'
import { joinRoom } from '@/app/dashboard/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const initialState = {
    error: '',
}

export function JoinRoomForm() {
    const [state, formAction] = useFormState(joinRoom, initialState)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Join a Room</CardTitle>
                <CardDescription>Enter a Room ID to join.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                        <Input name="roomId" placeholder="UUID..." required />
                        {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
                    </div>
                    <Button type="submit">Join</Button>
                </form>
            </CardContent>
        </Card>
    )
}
