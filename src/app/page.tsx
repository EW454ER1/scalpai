'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageGenerator } from '@/components/image-generator';
import { SongGenerator } from '@/components/song-generator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem('muse-ai-username');
    if (!username) {
      router.push('/login');
    }
  }, [router]);
  
  if (typeof window !== 'undefined' && !localStorage.getItem('muse-ai-username')) {
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
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Muse AI
          </h1>
          <p className="mt-2 text-lg sm:text-xl text-muted-foreground">
            Unleash your creativity with AI-powered image and song generation.
          </p>
        </header>

        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="image" className="text-base">
              <ImageIcon className="mr-2 h-5 w-5" />
              Image Generation
            </TabsTrigger>
            <TabsTrigger value="song" className="text-base">
              <Music className="mr-2 h-5 w-5" />
              Song Generation
            </TabsTrigger>
          </TabsList>
          <TabsContent value="image" className="mt-6">
            <ImageGenerator />
          </TabsContent>
          <TabsContent value="song" className="mt-6">
            <SongGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
