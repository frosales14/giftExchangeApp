import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Wishlist } from './wishlist'
import { StartExchangeButton } from '@/components/start-exchange-button'

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { id: roomId } = await params

    // Fetch Room
    const { data: room, error } = await supabase
        .from('rooms')
        .select('*, participants(*, profiles:profiles!participants_user_id_fkey(*))')
        .eq('id', roomId)
        .single()

    if (error || !room) {
        return notFound()
    }

    const currentUserParticipant = room.participants.find((p: any) => p.user_id === user.id)

    // Fetch Target if paired
    let targetProfile = null
    let targetWishlist: string[] = []

    if (currentUserParticipant?.target_id) {
        // We can fetch target via RLS or direct query if RLS allows
        // Since we enabled RLS for participants to view others in room, we can find the target in room.participants
        const target = room.participants.find((p: any) => p.user_id === currentUserParticipant.target_id)
        if (target) {
            targetProfile = target.profiles
            targetWishlist = target.wishlist
        }
    }

    const isAdmin = room.created_by === user.id
    const isClosed = room.status !== 'open'

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">{room.name}</h1>
                    <Badge variant={room.status === 'open' ? 'default' : 'secondary'} className="mt-2 uppercase">
                        {room.status}
                    </Badge>
                </div>
                {(isAdmin && room.status === 'open') && (
                    <StartExchangeButton roomId={roomId} />
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Your Status / Target */}
                <div className="space-y-6">
                    {isClosed ? (
                        <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg border border-green-200 dark:border-green-900">
                            <h2 className="text-xl font-semibold mb-4 text-green-800 dark:text-green-100">You are the Secret Santa for:</h2>
                            {targetProfile ? (
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar className="w-16 h-16">
                                        <AvatarImage src={targetProfile.avatar_url} />
                                        <AvatarFallback>{targetProfile.full_name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-2xl font-bold">{targetProfile.full_name}</p>
                                    </div>
                                </div>
                            ) : (
                                <p>Loading target...</p>
                            )}

                            <Separator className="my-4" />
                            <h3 className="font-semibold mb-2">Their Wishlist:</h3>
                            <Wishlist items={targetWishlist} readOnly />
                        </div>
                    ) : (
                        <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-900">
                            <h2 className="text-xl font-semibold mb-2 text-blue-800 dark:text-blue-100">Waiting for players...</h2>
                            <p className="text-blue-600 dark:text-blue-200">
                                Invite friends by sharing the Room ID: <code className="bg-white/50 px-2 py-1 rounded select-all">{roomId}</code>
                            </p>
                        </div>
                    )}

                    {/* Your Wishlist */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Your Wishlist</h3>
                        <Wishlist roomId={roomId} items={currentUserParticipant?.wishlist || []} />
                    </div>
                </div>

                {/* Right Column: Participants */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Participants ({room.participants.length})</h3>
                    <div className="grid gap-4">
                        {room.participants.map((p: any) => (
                            <div key={p.user_id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                <Avatar>
                                    <AvatarImage src={p.profiles?.avatar_url} />
                                    <AvatarFallback>{p.profiles?.full_name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{p.profiles?.full_name || 'Santa Helper'}</p>
                                    {p.user_id === room.created_by && <Badge variant="outline" className="text-xs">Admin</Badge>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
