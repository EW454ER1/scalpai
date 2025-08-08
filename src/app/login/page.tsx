'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Send, LogIn, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [hasClickedJoin, setHasClickedJoin] = useState(false);
  const [hasConfirmedJoin, setHasConfirmedJoin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('muse-ai-username')) {
      router.push('/');
    }
  }, [router]);

  const handleJoinClick = () => {
    setHasClickedJoin(true);
  };
  
  const handleConfirmClick = () => {
    setHasConfirmedJoin(true);
  }

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
            الرجاء إدخال اسم مستخدم والانضمام إلى قناة التليجرام للمتابعة.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-lg">اسم المستخدم</Label>
            <Input
              id="username"
              placeholder="أدخل اسم المستخدم الخاص بك"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          
          {!hasClickedJoin && (
            <a
              href="https://t.me/gmt_apt"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleJoinClick}
            >
              <Button variant="outline" className="w-full text-lg py-6">
                <Send className="mr-2 h-5 w-5" />
                الانضمام إلى قناة التليجرام
              </Button>
            </a>
          )}

          {hasClickedJoin && !hasConfirmedJoin && (
             <Button variant="outline" className="w-full text-lg py-6" onClick={handleConfirmClick}>
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              لقد انضممت، تحقق الآن
            </Button>
          )}
          
          {hasConfirmedJoin && (
             <Button variant="outline" className="w-full text-lg py-6" disabled>
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              تم التحقق من الانضمام
            </Button>
          )}

          <Button
            onClick={handleContinue}
            disabled={!username.trim() || !hasConfirmedJoin}
            className="w-full text-lg py-6"
          >
            <LogIn className="mr-2 h-5 w-5" />
            متابعة إلى التطبيق
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
