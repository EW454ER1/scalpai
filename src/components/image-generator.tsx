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
import { generateImages, GenerateImagesInput } from '@/ai/flows/generate-images';
import { Loader2 } from 'lucide-react';

const imageFormSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters long.',
  }).max(4000, {
    message: 'Prompt cannot be more than 4000 characters long.',
  }),
  style: z.string({
    required_error: 'Please select an image style.',
  }),
});

type ImageFormValues = z.infer<typeof imageFormSchema>;

const imageStyles = ['cartoon', 'realistic', '3D', 'sci-fi', 'artistic'];

export function ImageGenerator() {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      prompt: '',
      style: 'realistic',
    },
  });

  async function onSubmit(data: ImageFormValues) {
    setIsLoading(true);
    setGeneratedImages([]);
    try {
      const result = await generateImages(data as GenerateImagesInput);
      setGeneratedImages(result.images);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error generating images',
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
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Image Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., A futuristic cityscape at sunset with flying cars"
                      className="resize-none h-28"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe the image you want to create in detail.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Image Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {imageStyles.map((style) => (
                        <SelectItem key={style} value={style} className="capitalize">
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the artistic style for your images.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isLoading ? 'Generating...' : 'Generate Images'}
            </Button>
          </form>
        </Form>
        
        {isLoading && (
          <div className="mt-8 pt-8 border-t border-border/40">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="aspect-square bg-muted/50 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {generatedImages.length > 0 && (
          <div className="mt-8 pt-8 border-t border-border/40">
            <h3 className="text-2xl font-headline font-bold mb-4">Generated Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {generatedImages.map((src, index) => (
                <Card key={index} className="overflow-hidden group border-border/40">
                  <CardContent className="p-0">
                    <div className="aspect-square relative">
                      <Image
                        src={src}
                        alt={`Generated image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
