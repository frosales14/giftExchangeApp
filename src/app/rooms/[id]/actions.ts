'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function addToWishlist(roomId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const item = formData.get('item') as string
    if (!item) return

    // Get current wishlist
    const { data: participant } = await supabase
        .from('participants')
        .select('wishlist')
        .eq('room_id', roomId)
        .eq('user_id', user.id)
        .single()

    const currentList = participant?.wishlist || []

    if (currentList.length >= 5) {
        // Optional: Return error state
        return
    }

    const updatedList = [...currentList, item]

    await supabase
        .from('participants')
        .update({ wishlist: updatedList })
        .eq('room_id', roomId)
        .eq('user_id', user.id)

    revalidatePath(`/rooms/${roomId}`)
}

export async function removeFromWishlist(roomId: string, itemToRemove: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: participant } = await supabase
        .from('participants')
        .select('wishlist')
        .eq('room_id', roomId)
        .eq('user_id', user.id)
        .single()

    const currentList = participant?.wishlist || []
    const updatedList = currentList.filter((i: string) => i !== itemToRemove)

    await supabase
        .from('participants')
        .update({ wishlist: updatedList })
        .eq('room_id', roomId)
        .eq('user_id', user.id)

    revalidatePath(`/rooms/${roomId}`)
}

export async function startExchange(roomId: string, prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Check if admin is implicit in the RPC or we check here? 
    // The RPC checks it.

    const { error } = await supabase.rpc('pair_participants', { room_id_arg: roomId })

    if (error) {
        console.error(error)
        return { error: error.message }
    }

    revalidatePath(`/rooms/${roomId}`)
}
