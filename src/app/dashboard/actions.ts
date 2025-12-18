'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createRoom(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const name = formData.get('name') as string
    if (!name) return { error: 'Room name is required' }

    // 1. Create room
    const { data: room, error: roomError } = await supabase
        .from('rooms')
        .insert({ name, created_by: user.id })
        .select()
        .single()

    if (roomError) {
        console.error(roomError)
        return { error: 'Failed to create room' }
    }

    // 2. Add creator as participant
    const { error: partError } = await supabase
        .from('participants')
        .insert({ room_id: room.id, user_id: user.id })

    if (partError) {
        // cleanup?
        console.error('Error adding creator to participants:', partError)
        return { error: 'Failed to join room' }
    }

    console.log('--- Create Room Success ---')
    console.log('Redirecting to:', `/rooms/${room.id}`)

    revalidatePath('/dashboard')
    redirect(`/rooms/${room.id}`)
}

export async function joinRoom(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const roomId = formData.get('roomId') as string
    if (!roomId) return { error: 'Room ID is required' }

    // Check if room exists and is open
    const { data: room, error: roomCheckError } = await supabase
        .from('rooms')
        .select('status')
        .eq('id', roomId)
        .single()

    if (roomCheckError || !room) {
        return { error: 'Room not found' }
    }

    if (room.status !== 'open') {
        return { error: 'Room is closed for new participants' }
    }

    const { error: joinError } = await supabase
        .from('participants')
        .insert({ room_id: roomId, user_id: user.id })

    if (joinError) {
        if (joinError.code === '23505') { // unique violation
            redirect(`/rooms/${roomId}`)
        }
        return { error: 'Failed to join room' }
    }

    revalidatePath('/dashboard')
    redirect(`/rooms/${roomId}`)
}
