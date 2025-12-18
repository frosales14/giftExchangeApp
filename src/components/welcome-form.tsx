'use client'

import { useFormState } from 'react-dom'
import { updateProfile } from '@/app/welcome/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState = {
    error: '',
}

export function WelcomeForm() {
    const [state, formAction] = useFormState(updateProfile, initialState)

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" required placeholder="Santa Claus" />
            </div>
            {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
            <Button type="submit" className="w-full">Get Started</Button>
        </form>
    )
}
