'use client';

import Link from "next/link"
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserContext } from "@/context/user-context";
import { useTranslation } from "@/context/language-context";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const { login, teachers } = useContext(UserContext);
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogin = () => {
    setError('');
    setIsShaking(false);
    const userToLogin = teachers.find(t => t.email === email);
    
    if (userToLogin) {
      if (userToLogin.password !== password) {
        setError(t('login.passwordIncorrect'));
        return;
      }
      
      if(userToLogin.role === 'teacher' && !userToLogin.isApproved) {
        setError(t('login.pendingApproval'));
        return;
      }
      
      login(userToLogin);
      
      const redirectUrl = userToLogin.role === 'admin' ? '/admin' : '/teacher';
      router.push(redirectUrl);
    } else {
      setError(t('login.emailIncorrect'));
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-secondary p-4">
      <Card className={cn(
        "mx-auto max-w-sm w-full shadow-2xl transition-transform duration-500",
        isShaking ? 'animate-shake' : 'animate-in fade-in-50 zoom-in-95'
      )}>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{t('login.title')}</CardTitle>
          <CardDescription>
            {t('login.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t('login.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">{t('login.password')}</Label>
                <Link href="#" className="ml-auto inline-block text-sm text-primary hover:underline">
                  {t('login.forgotPassword')}
                </Link>
              </div>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="button" className="w-full" onClick={handleLogin}>
              {t('login.loginButton')}
            </Button>
            <Button variant="outline" className="w-full">
              {t('login.googleButton')}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            {t('login.noAccount')}{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              {t('login.signUpLink')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
