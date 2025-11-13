'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useContext } from "react";
import { UserContext } from "@/context/user-context";
import { useTranslation } from "@/context/language-context";

export function UserNav() {
  const { user, logout, questions } = useContext(UserContext);
  const { t } = useTranslation();

  if (!user) {
    return null;
  }
  
  const dashboardLink = user.role === 'admin' ? '/admin' : '/teacher';
  
  const pendingQuestionCount = user.role === 'admin' 
    ? questions.filter(q => q.status === 'pending').length
    : questions.filter(q => q.teacherId === user.id && q.status === 'pending').length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
           {pendingQuestionCount > 0 && (
            <span className="absolute top-0 right-0 -mr-1 -mt-1 flex h-4 w-4">
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">
                {pendingQuestionCount}
              </span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={dashboardLink}>{t('userNav.dashboard')}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/teacher/settings">{t('userNav.settings')}</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          {t('userNav.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
