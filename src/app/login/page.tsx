'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Send, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [hasClickedTelegram, setHasClickedTelegram] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('muse-ai-username')) {
      router.push('/');
    }
  }, [router]);

  const handleJoinTelegram = () => {
    setHasClickedTelegram(true);
  };

  const handleContinue = () => {
    if (username.trim()) {
      localStorage.setItem('muse-ai-username', username);
      router.push('/');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-headline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to Muse AI
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-2">
            Please enter a username and join our Telegram channel to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-lg">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          <a
            href="https://t.me/gmt_apt"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleJoinTelegram}
            className={hasClickedTelegram ? 'pointer-events-none' : ''}
          >
            <Button variant="outline" className="w-full text-lg py-6" disabled={hasClickedTelegram}>
              <Send className="mr-2 h-5 w-5" />
              {hasClickedTelegram ? 'Joined Telegram Channel' : 'Join Telegram Channel'}
            </Button>
          </a>
          <Button
            onClick={handleContinue}
            disabled={!username.trim() || !hasClickedTelegram}
            className="w-full text-lg py-6"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Continue to App
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
