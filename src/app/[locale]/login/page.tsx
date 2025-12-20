import { login, signup } from './actions'
import { GoogleSignInButton } from '@/components/google-signin-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const params = await searchParams
    const t = await getTranslations('Auth');

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">{t('loginTitle')}</CardTitle>
                    <CardDescription>{t('loginDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" suppressHydrationWarning>
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('emailLabel')}</Label>
                            <Input id="email" name="email" type="email" required placeholder="santa@northpole.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t('passwordLabel')}</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        {params?.error && (
                            <div className="text-red-500 text-sm font-medium text-center">
                                {params.error}
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <Button formAction={login} className="w-full">{t('signIn')}</Button>
                            <Button formAction={signup} variant="outline" className="w-full">{t('signUp')}</Button>
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">{t('orContinueWith')}</span>
                                </div>
                            </div>
                            <GoogleSignInButton />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
