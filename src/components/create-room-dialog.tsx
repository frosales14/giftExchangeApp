'use client'

import { useFormState } from 'react-dom'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createRoom } from "@/app/dashboard/actions"

const initialState = {
    error: '',
}

export function CreateRoomDialog() {
    const [state, formAction] = useFormState(createRoom, initialState)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Create Room</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a Secret Santa Room</DialogTitle>
                    <DialogDescription>
                        Give your room a fun name. You'll be the admin.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" name="name" className="col-span-3" required />
                    </div>
                    {state?.error && <div className="text-red-500 text-sm text-center">{state.error}</div>}
                    <DialogFooter>
                        <Button type="submit">Create Room</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
