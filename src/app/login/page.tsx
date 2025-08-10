'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Send, LogIn, CheckCircle, KeyRound, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [hasClickedJoin, setHasClickedJoin] = useState(false);
  const [hasConfirmedJoin, setHasConfirmedJoin] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (localStorage.getItem('scalpking-ai-username') && localStorage.getItem('gemini-api-key')) {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    const ref = searchParams?.get('ref');
    if (ref) {
      // You can store the referral information here.
      // For now, we just show a toast message.
      toast({
        title: 'أهلاً بك!',
        description: `لقد تمت إحالتك بواسطة ${ref}.`,
      });
      localStorage.setItem('referral', ref);
    }
  }, [searchParams, toast]);

  const handleJoinClick = () => {
    setHasClickedJoin(true);
  };
  
  const handleConfirmClick = () => {
    setHasConfirmedJoin(true);
  }

  const handleContinue = () => {
    if (username.trim() && apiKey.trim()) {
      localStorage.setItem('scalpking-ai-username', username);
      localStorage.setItem('gemini-api-key', apiKey);
      window.location.href = '/';
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-headline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            أهلاً بك في SCALPKING AI
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-2">
            الرجاء إدخال اسم مستخدم ومفتاح API والانضمام إلى قناة التليجرام للمتابعة.
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

          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-lg">Google Gemini API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="أدخل مفتاح API الخاص بك"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="h-12 text-base"
            />
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className='pt-2'
            >
              <Button variant="link" className="p-0 h-auto">
                إنشاء مفتاح API جديد
                <ArrowLeft className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
          
          {!hasClickedJoin && (
            <Button 
              variant="outline" 
              className="w-full text-lg py-6"
              onClick={() => {
                handleJoinClick();
                window.open('https://t.me/gmt_apt', '_blank', 'noopener,noreferrer');
              }}
            >
              <Send className="mr-2 h-5 w-5" />
              الانضمام إلى قناة التليجرام
            </Button>
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
            disabled={!username.trim() || !apiKey.trim() || !hasConfirmedJoin}
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold font-headline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              أهلاً بك في SCALPKING AI
            </CardTitle>
            <CardDescription className="text-muted-foreground pt-2">
              جاري التحميل...
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}

    