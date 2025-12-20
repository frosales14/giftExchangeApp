'use client'

import { useActionState } from 'react'
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
import { createRoom } from "@/app/[locale]/dashboard/actions"
import { useTranslations } from 'next-intl'

const initialState = {
    error: '',
}

export function CreateRoomDialog() {
    const [state, formAction] = useActionState(createRoom, initialState)
    const t = useTranslations('Dashboard');
    const tCommon = useTranslations('Common');

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>{t('createRoom')}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('createRoom')}</DialogTitle>
                    <DialogDescription>
                        Give your room a fun name. You'll be the admin.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="grid gap-4 py-4" suppressHydrationWarning>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            {t('roomName')}
                        </Label>
                        <Input id="name" name="name" className="col-span-3" required />
                    </div>
                    {state?.error && <div className="text-red-500 text-sm text-center">{state.error}</div>}
                    <DialogFooter>
                        <Button type="submit">{t('create')}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
