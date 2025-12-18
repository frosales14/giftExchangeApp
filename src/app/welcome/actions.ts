'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const fullName = formData.get('fullName') as string

    if (!fullName) {
        return { error: 'Full name is required' }
    }

    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            full_name: fullName,
            avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`,
        })

    if (error) {
        return { error: 'Could not update profile' }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}
