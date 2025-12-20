import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WelcomeForm } from '@/components/welcome-form'
import { getTranslations } from 'next-intl/server'

export default async function WelcomePage() {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
                    <CardDescription>Let's get to know you better. What should we call you?</CardDescription>
                </CardHeader>
                <CardContent>
                    <WelcomeForm />
                </CardContent>
            </Card>
        </div>
    )
}
