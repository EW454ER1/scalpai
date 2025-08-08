'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageGenerator } from '@/components/image-generator';
import { TextToSpeechGenerator } from '@/components/text-to-speech-generator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageIcon, Send, Speech, Gift, Copy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const { toast } = useToast();
  const walletAddress = 'TDKeWZ7NZaEkQEVvvSKrdrMhC5V8P8b9cW';

  useEffect(() => {
    const storedUsername = localStorage.getItem('scalpking-ai-username');
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (!storedUsername || !storedApiKey) {
      router.push('/login');
    } else {
      setUsername(storedUsername);
    }
    setIsClient(true);
  }, [router]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: 'تم النسخ!',
      description: 'تم نسخ عنوان المحفظة إلى الحافظة.',
    });
  }

  if (!isClient || !username) {
    return (
        <div className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background text-foreground">
            <div className="w-full max-w-4xl mx-auto space-y-8">
                <Skeleton className="h-16 w-1/2 mx-auto" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background text-foreground">
      <div className="w-full max-w-4xl mx-auto flex flex-col flex-grow">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SCALPKING AI
          </h1>
          <p className="mt-2 text-lg sm:text-xl text-muted-foreground">
            Unleash your creativity with AI-powered image and speech generation.
          </p>
        </header>

        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="image" className="text-base">
              <ImageIcon className="mr-2 h-5 w-5" />
              Image Generation
            </TabsTrigger>
            <TabsTrigger value="speech" className="text-base">
              <Speech className="mr-2 h-5 w-5" />
              Text to Speech
            </TabsTrigger>
          </TabsList>
          <TabsContent value="image" className="mt-6">
            <ImageGenerator />
          </TabsContent>
          <TabsContent value="speech" className="mt-6">
            <TextToSpeechGenerator />
          </TabsContent>
        </Tabs>
      </div>
      <footer className="w-full max-w-4xl mx-auto mt-12 pt-8 border-t border-border/40 text-center text-muted-foreground">
          <p className="mb-4">كدعم للموقع، يمكنك الانضمام إلى قناتنا على تليجرام أو إرسال هدية:</p>
          <div className="flex justify-center items-center gap-4">
            <a
                href="https://t.me/gmt_apt"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <Send className="mr-2 h-4 w-4" />
                  انضم إلى القناة
                </Button>
            </a>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <Gift className="mr-2 h-4 w-4" />
                  إرسال هدية للمطور
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center text-2xl">دعم المطور</AlertDialogTitle>
                  <AlertDialogDescription className="text-center">
                    يمكنك دعم المطور عن طريق إرسال هدية إلى عنوان المحفظة أدناه.
                    <br/>
                    TRC20 USDT
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                     {/* You can place your QR code image here. For now, it's a placeholder. */}
                     <div className="w-48 h-48 bg-gray-300 flex items-center justify-center rounded-md">
                        <p className="text-sm text-gray-500">QR Code Placeholder</p>
                     </div>
                  </div>
                  <div className="p-3 bg-muted rounded-md text-center break-all text-sm font-mono">
                    {walletAddress}
                  </div>
                   <Button onClick={copyToClipboard} variant="secondary" className="w-full">
                      <Copy className="mr-2 h-4 w-4" />
                      نسخ العنوان
                    </Button>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>إغلاق</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
      </footer>
    </main>
  );
}
