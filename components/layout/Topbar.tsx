"use client";

import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface TopbarProps {
  onMenuClick?: () => void;
  title?: string;
}

export const Topbar = ({ onMenuClick, title }: TopbarProps) => {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-muted-foreground"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        {title && <h1 className="text-lg font-semibold tracking-tight hidden md:block">{title}</h1>}
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end">
        <div className="relative w-full max-w-sm hidden lg:block" role="search" aria-label="Site search">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input 
            type="search" 
            aria-label="Search transactions and payment links"
            placeholder="Search transactions, payment links..." 
            className="pl-9 bg-muted/40 border-border/50 focus-visible:ring-primary rounded-full h-9"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src="/avatars/01.png" alt="@merchant" />
                <AvatarFallback className="bg-primary/20 text-primary">JD</AvatarFallback>
              </Avatar>
            </Button>
          } />
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Merchant Corp</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@merchantcorp.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>API Keys</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
