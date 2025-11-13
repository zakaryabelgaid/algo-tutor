'use client';

import Link from 'next/link';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserContext } from '@/context/user-context';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/language-context';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { addTeacher } = useContext(UserContext);
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleRegister = () => {
    if (!firstName || !lastName || !email || !password) {
      toast({
        variant: 'destructive',
        title: t('register.toast.missing.title'),
        description: t('register.toast.missing.description'),
      });
      return;
    }
    
    addTeacher({
      name: `${firstName} ${lastName}`,
      email,
      password, // Note: In a real app, you'd never store passwords in plain text.
      bio: t('register.defaultBio'),
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200`, 
      isApproved: false,
      role: 'teacher'
    });

    toast({
      title: t('register.toast.success.title'),
      description: t('register.toast.success.description'),
    });

    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-secondary p-4">
      <Card className="mx-auto max-w-sm w-full shadow-2xl animate-in fade-in-50 zoom-in-95 duration-500">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            {t('register.title')}
          </CardTitle>
          <CardDescription>
            {t('register.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">{t('register.firstName')}</Label>
                <Input id="first-name" placeholder={t('register.firstNamePlaceholder')} required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">{t('register.lastName')}</Label>
                <Input id="last-name" placeholder={t('register.lastNamePlaceholder')} required value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t('register.email')}</Label>
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
              <Label htmlFor="password">{t('register.password')}</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="button" className="w-full" onClick={handleRegister}>
              {t('register.createAccountButton')}
            </Button>
            <Button variant="outline" className="w-full">
              {t('register.googleButton')}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            {t('register.alreadyHaveAccount')}{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              {t('register.signInLink')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
