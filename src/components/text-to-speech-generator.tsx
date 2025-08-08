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
import { textToSpeech, TextToSpeechInput, TextToSpeechOutput } from '@/ai/flows/customize-song-generation';
import { Loader2 } from 'lucide-react';

const speechFormSchema = z.object({
  text: z.string().min(10, {
    message: 'Text must be at least 10 characters long.',
  }).max(4000, {
    message: 'Text cannot be more than 4000 characters long.',
  }),
  voice: z.enum(['male', 'female'], { required_error: 'Please select a voice type.' }),
  mood: z.enum(['none', 'sad', 'angry', 'comedy', 'romantic'], { required_error: 'Please select a mood.' }),
  dialect: z.enum(['egyptian', 'tunisian', 'saudi', 'kuwaiti', 'lebanese', 'libyan'], { required_error: 'Please select a dialect.' }),
});

type SpeechFormValues = z.infer<typeof speechFormSchema>;

const voices = ['male', 'female'];
const moods = ['none', 'sad', 'angry', 'comedy', 'romantic'];
const dialects = [
    { value: 'egyptian', label: 'مصرية' },
    { value: 'tunisian', label: 'تونسية' },
    { value: 'saudi', label: 'سعودية' },
    { value: 'kuwaiti', label: 'كويتية' },
    { value: 'lebanese', label: 'لبنانية' },
    { value: 'libyan', label: 'ليبية' },
];


export function TextToSpeechGenerator() {
  const [generatedSpeech, setGeneratedSpeech] = useState<TextToSpeechOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SpeechFormValues>({
    resolver: zodResolver(speechFormSchema),
    defaultValues: {
      text: '',
      voice: 'female',
      mood: 'none',
      dialect: 'egyptian',
    },
  });

  async function onSubmit(data: SpeechFormValues) {
    setIsLoading(true);
    setGeneratedSpeech(null);
    try {
      const result = await textToSpeech(data as TextToSpeechInput);
      setGeneratedSpeech(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Speech',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
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
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">النص</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="اكتب النص الذي تريد تحويله إلى كلام..."
                      className="resize-none h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>النص الذي سيتم تحويله إلى كلام.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <FormField
                control={form.control}
                name="voice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الصوت</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الصوت" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {voices.map((v) => (
                          <SelectItem key={v} value={v} className="capitalize">
                            {v === 'male' ? 'ذكر' : 'أنثى'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحالة المزاجية</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر حالة مزاجية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {moods.map(mood => (
                          <SelectItem key={mood} value={mood} className="capitalize">
                            {mood === 'none' ? 'عادي' : mood}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="dialect"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اللهجة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر لهجة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dialects.map(dialect => (
                          <SelectItem key={dialect.value} value={dialect.value} className="capitalize">
                            {dialect.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isLoading ? '...جاري الإنشاء' : 'إنشاء مقطع صوتي'}
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

        {generatedSpeech && (
          <div className="mt-8 pt-8 border-t border-border/40">
            <h3 className="text-2xl font-headline font-bold mb-4">المقطع الصوتي الخاص بك</h3>
            <Card className="overflow-hidden border-border/40">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col items-center sm:items-start w-full gap-2">
                        <p className="text-xl font-semibold font-headline">مقطع صوتي مُنشأ</p>
                        <p className="text-sm text-muted-foreground">استمع إلى إبداعك المدعوم بالذكاء الاصطناعي أدناه.</p>
                        <audio controls src={generatedSpeech.audioUrl} className="w-full mt-2">
                            متصفحك لا يدعم عنصر الصوت.
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
