'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageGenerator } from '@/components/image-generator';
import { TextToSpeechGenerator } from '@/components/text-to-speech-generator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageIcon, Send, Speech, Gift, Copy, Share2, Upload, Download, LogOut } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const { toast } = useToast();
  const walletAddress = 'TDKeWZ7NZaEkQEVvvSKrdrMhC5V8P8b9cW';
  const referralBonus = 0.50;
  const minWithdrawal = 100;
  const withdrawalFee = 0.05; // 5%
  // This is a placeholder for the user's balance. A real backend is needed for this.
  const [balance, setBalance] = useState(0.00); 

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
  
  const copyToClipboard = (textToCopy: string, toastMessage: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: 'تم النسخ!',
      description: toastMessage,
    });
  }

  const handleShare = () => {
    if (username) {
      const referralLink = `${window.location.origin}/login?ref=${username}`;
      copyToClipboard(referralLink, `تم نسخ رابط الإحالة. ستحصل على $${referralBonus.toFixed(2)} عن كل صديق يسجل وينضم للقناة!`);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('scalpking-ai-username');
    localStorage.removeItem('gemini-api-key');
    router.push('/login');
  };

  const handleWithdrawClick = () => {
    if (balance < minWithdrawal) {
      toast({
        title: 'الرصيد غير كافٍ',
        description: `يجب أن يصل رصيدك إلى ${minWithdrawal}$ على الأقل لتتمكن من السحب.`,
        variant: 'destructive',
      });
    }
  };

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
        <header className="w-full mb-8 md:mb-12">
            <div className="flex justify-between items-center mb-4">
                 <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    SCALPKING AI
                 </h1>
                 <div className='hidden sm:flex items-center gap-2'>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        تسجيل الخروج
                    </Button>
                    <Button variant="outline" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" />
                        مشاركة
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline">
                                <Upload className="mr-2 h-4 w-4" />
                                إيداع
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle className="text-center text-2xl">دعم المطور</AlertDialogTitle>
                            <AlertDialogDescription className="text-center">
                                يمكنك دعم المطور عن طريق إرسال هدية إلى عنوان المحفظة أدناه.
                                <br/>
                                هذا الدعم يساعد في تطوير الموقع ليصبح أقوى وأكثر احترافية.
                                <br/>
                                TRC20 USDT
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-muted rounded-lg">
                                <Image 
                                  src="/qr-code.png"
                                  alt="QR Code for wallet address"
                                  width={192}
                                  height={192}
                                  className="rounded-md"
                                  data-ai-hint="qr code"
                                />
                            </div>
                            <div className="p-3 bg-muted rounded-md text-center break-all text-sm font-mono">
                                {walletAddress}
                            </div>
                            <Button onClick={() => copyToClipboard(walletAddress, 'تم نسخ عنوان المحفظة إلى الحافظة.')} variant="secondary" className="w-full">
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
            </div>
            <Card className="bg-card/50">
                <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className='text-center sm:text-left'>
                        <p className="text-muted-foreground">أهلاً بك، {username}!</p>
                        <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">رصيدك الحالي</p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    onClick={handleWithdrawClick}
                                    disabled={balance < minWithdrawal}
                                    className="flex-1"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    سحب
                                </Button>
                            </AlertDialogTrigger>
                            {balance >= minWithdrawal && (
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>طلب سحب</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            أدخل عنوان محفظة TRC20 والمبلغ الذي تود سحبه. سيتم خصم رسوم بنسبة {(withdrawalFee * 100)}%.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="walletAddress">عنوان المحفظة (TRC20)</Label>
                                            <Input id="walletAddress" placeholder="أدخل عنوان محفظتك" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="amount">المبلغ ($)</Label>
                                            <Input id="amount" type="number" placeholder={`الحد الأدنى ${minWithdrawal}$`} />
                                        </div>
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => toast({ title: 'قيد الإنشاء', description: 'سيتم تفعيل هذه الميزة قريباً.', variant: 'destructive'})}>
                                            تأكيد السحب
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            )}
                        </AlertDialog>

                        <div className='sm:hidden flex-1'>
                             <Button variant="outline" onClick={handleShare} className='w-full'>
                                <Share2 className="mr-2 h-4 w-4" />
                                مشاركة
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
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
                     <Image 
                        src="/qr-code.png"
                        alt="QR Code for wallet address"
                        width={192}
                        height={192}
                        className="rounded-md"
                        data-ai-hint="qr code"
                     />
                  </div>
                  <div className="p-3 bg-muted rounded-md text-center break-all text-sm font-mono">
                    {walletAddress}
                  </div>
                   <Button onClick={() => copyToClipboard(walletAddress, 'تم نسخ عنوان المحفظة إلى الحافظة.')} variant="secondary" className="w-full">
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
