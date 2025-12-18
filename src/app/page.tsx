import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Gift, Users, Shuffle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-gradient-to-r from-red-600 to-green-600 text-transparent bg-clip-text">
            Secret Santa
          </h1>
          <p className="text-xl text-muted-foreground">
            The easiest way to organize your holiday gift exchange. No pairing headaches, just fun.
          </p>
        </div>

        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="text-lg px-8">Log In</Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full text-left">
          <Card>
            <CardHeader>
              <Gift className="w-10 h-10 text-red-500 mb-2" />
              <CardTitle>Wishlists</CardTitle>
              <CardDescription>Share exactly what you want (up to 5 items) so your Santa gets it right.</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-10 h-10 text-green-500 mb-2" />
              <CardTitle>Room Management</CardTitle>
              <CardDescription>Create private rooms, invite friends via ID, and manage participants.</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shuffle className="w-10 h-10 text-blue-500 mb-2" />
              <CardTitle>Automatic Pairing</CardTitle>
              <CardDescription>One-click pairing ensuring everyone gets a gift and no one pairs with themselves.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        <p>Built with Next.js, Supabase, and Tailwind CSS.</p>
      </footer>
    </div>
  )
}
