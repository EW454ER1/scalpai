'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { customizeSongGeneration, CustomizeSongGenerationInput, CustomizeSongGenerationOutput } from '@/ai/flows/customize-song-generation';
import { Loader2 } from 'lucide-react';

const songFormSchema = z.object({
  lyrics: z.string().min(20, {
    message: 'Lyrics must be at least 20 characters long.',
  }).max(4000, {
    message: 'Lyrics cannot be more than 4000 characters long.',
  }),
  voiceType: z.enum(['male', 'female'], { required_error: 'Please select a voice type.' }),
  language: z.enum(['arabic', 'english', 'spanish'], { required_error: 'Please select a language.' }),
  songType: z.enum(['romantic', 'children', 'rap', 'religious'], { required_error: 'Please select a song type.' }),
  musicStyle: z.enum(['piano', 'oud', 'electro', 'kpop'], { required_error: 'Please select a music style.' }),
});

type SongFormValues = z.infer<typeof songFormSchema>;

const voiceTypes = ['male', 'female'];
const languages = ['english', 'spanish', 'arabic'];
const songTypes = ['romantic', 'children', 'rap', 'religious'];
const musicStyles = ['piano', 'oud', 'electro', 'kpop'];

export function SongGenerator() {
  const [generatedSong, setGeneratedSong] = useState<CustomizeSongGenerationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SongFormValues>({
    resolver: zodResolver(songFormSchema),
    defaultValues: {
      lyrics: '',
      voiceType: 'female',
      language: 'english',
      songType: 'romantic',
      musicStyle: 'piano',
    },
  });

  async function onSubmit(data: SongFormValues) {
    setIsLoading(true);
    setGeneratedSong(null);
    try {
      let result = await customizeSongGeneration(data as CustomizeSongGenerationInput);

      if (!result.songUrl || !result.songUrl.startsWith('http')) {
        toast({
          title: "Demo Mode",
          description: "The AI is composing your song! As this is a demo, you'll hear a placeholder tune. The full feature is coming soon.",
        });
        result = {
          songUrl: 'https://storage.googleapis.com/studioprompt/placeholder.mp3',
          coverImageUrl: `https://placehold.co/400x400.png`
        };
      }
      setGeneratedSong(result);

    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Song',
        description: 'An unexpected error occurred. Please enjoy this placeholder song while we resolve the issue.',
        variant: 'destructive',
      });
      setGeneratedSong({
        songUrl: 'https://storage.googleapis.com/studioprompt/placeholder.mp3',
        coverImageUrl: `https://placehold.co/400x400.png`
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-border/40 shadow-lg">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="lyrics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Lyrics</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write the lyrics for your song here..."
                      className="resize-none h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>The words that will be turned into a song.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="voiceType" render={({ field }) => (
                    <FormItem><FormLabel>Voice Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select voice" /></SelectTrigger></FormControl><SelectContent>{voiceTypes.map(v => <SelectItem key={v} value={v} className="capitalize">{v}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="language" render={({ field }) => (
                    <FormItem><FormLabel>Language</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger></FormControl><SelectContent>{languages.map(l => <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="songType" render={({ field }) => (
                    <FormItem><FormLabel>Song Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select song type" /></SelectTrigger></FormControl><SelectContent>{songTypes.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="musicStyle" render={({ field }) => (
                    <FormItem><FormLabel>Music Style</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select music style" /></SelectTrigger></FormControl><SelectContent>{musicStyles.map(m => <SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isLoading ? 'Generating...' : 'Generate Song'}
            </Button>
          </form>
        </Form>
        
        {isLoading && (
          <div className="mt-8 pt-8 border-t border-border/40 flex flex-col items-center justify-center">
             <div className="w-full max-w-sm space-y-4">
                <div className="aspect-square bg-muted/50 rounded-lg animate-pulse"></div>
                <div className="h-12 bg-muted/50 rounded-lg animate-pulse w-full"></div>
            </div>
          </div>
        )}

        {generatedSong && (
          <div className="mt-8 pt-8 border-t border-border/40">
            <h3 className="text-2xl font-headline font-bold mb-4">Your Masterpiece</h3>
            <Card className="overflow-hidden border-border/40">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 relative flex-shrink-0">
                        <Image
                            src={generatedSong.coverImageUrl}
                            alt="Generated song cover"
                            fill
                            className="rounded-md object-cover"
                            data-ai-hint="song album cover"
                            sizes="(max-width: 640px) 33vw, 10rem"
                        />
                    </div>
                    <div className="flex flex-col items-center sm:items-start w-full gap-2">
                        <p className="text-xl font-semibold font-headline">Generated Song</p>
                        <p className="text-sm text-muted-foreground">Listen to your AI-powered creation below.</p>
                        <audio controls src={generatedSong.songUrl} className="w-full mt-2">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
