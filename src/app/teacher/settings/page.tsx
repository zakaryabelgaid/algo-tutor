'use client';

import { useState, useContext, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/language-context';
import { UserContext } from '@/context/user-context';
import { Teacher } from '@/lib/types';

export default function TeacherSettingsPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user, updateUser } = useContext(UserContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setAvatar(user.avatarUrl || '');
    }
  }, [user]);

  const handleSaveChanges = () => {
    if(!user || !user.id) return;
    
    const updates: Partial<Teacher> = {
        name,
        email,
        bio,
        avatarUrl: avatar,
    };

    updateUser(user.id, updates);

    toast({
      title: t('teacher.settings.toast.saved.title'),
      description: t('teacher.settings.toast.saved.description'),
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return <div>{t('teacher.settings.notFound')}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">{t('teacher.settings.title')}</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('teacher.settings.avatar.title')}</CardTitle>
              <CardDescription>{t('teacher.settings.avatar.description')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button asChild variant="outline">
                <label htmlFor="avatar-upload">
                  {t('teacher.settings.avatar.changeButton')}
                  <input
                    id="avatar-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('teacher.settings.personal.title')}</CardTitle>
              <CardDescription>{t('teacher.settings.personal.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('teacher.settings.personal.labels.name')}</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('teacher.settings.personal.labels.email')}</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">{t('teacher.settings.personal.labels.bio')}</Label>
                <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder={t('teacher.settings.personal.placeholders.bio')}/>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('teacher.settings.password.title')}</CardTitle>
              <CardDescription>
                {t('teacher.settings.password.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">{t('teacher.settings.password.labels.current')}</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">{t('teacher.settings.password.labels.new')}</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t('teacher.settings.password.labels.confirm')}</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
          </Card>
           <div className="flex justify-end">
            <Button onClick={handleSaveChanges}>{t('teacher.settings.saveButton')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
