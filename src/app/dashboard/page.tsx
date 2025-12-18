import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CreateRoomDialog } from '@/components/create-room-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { joinRoom } from './actions'
import { JoinRoomForm } from '@/components/join-room-form'

export default async function DashboardPage() {
    const supabase = await createClient()

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // 2. Get User Profile (optional, to greet)
    // const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    // 3. Get Rooms where user is a participant
    const { data: participations } = await supabase
        .from('participants')
        .select('room_id, rooms(*)')
        .eq('user_id', user.id)

    const rooms = participations?.map((p: any) => p.rooms) || []

    return (
        <div className="container mx-auto p-8 space-y-8">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <CreateRoomDialog />
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Active Rooms */}
                {rooms.map((room) => (
                    <Link key={room.id} href={`/rooms/${room.id}`}>
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                            <CardHeader>
                                <CardTitle>{room.name}</CardTitle>
                                <CardDescription>Status: {room.status}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}

                {/* Join Room Card */}
                <JoinRoomForm />
            </div>
        </div>
    )
}
