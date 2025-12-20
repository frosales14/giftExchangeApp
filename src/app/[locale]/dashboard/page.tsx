import { createClient } from '@/lib/supabase/server'
import { redirect } from '@/i18n/routing'
import { Link } from '@/i18n/routing'
import { CreateRoomDialog } from '@/components/create-room-dialog'
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { JoinRoomForm } from '@/components/join-room-form'
import { getTranslations } from 'next-intl/server'
import { LanguageSwitcher } from '@/components/language-switcher'

export default async function DashboardPage() {
    const supabase = await createClient()
    const t = await getTranslations('Dashboard');

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect({ href: '/login', locale: 'en' })

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
                <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <CreateRoomDialog />
                </div>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Active Rooms */}
                {rooms.map((room) => (
                    <Link key={room.id} href={`/rooms/${room.id}`}>
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                            <CardHeader>
                                <CardTitle>{room.name}</CardTitle>
                                <CardDescription>{t('status')}: {room.status}</CardDescription>
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
