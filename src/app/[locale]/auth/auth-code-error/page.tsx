import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'

export default async function AuthCodeErrorPage() {
    const t = await getTranslations('Common');
    // ...
    return (
        <div className="flex h-screen items-center justify-center bg-red-50 dark:bg-red-950/20">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-red-600">Authentication Error</CardTitle>
                    <CardDescription>
                        We couldn't log you in. This often happens if the login link expired or was used already.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Link href="/login">
                        <Button variant="default">Try Logging In Again</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}
