'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, HelpCircle } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import { Input } from './ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const settingsSchema = z.object({
    businessContext: z.string().min(20, 'Please provide some context for your business.'),
    whatsappNumber: z.string().optional(),
    facebookPage: z.string().optional(),
    facebookPageId: z.string().optional(),
    instagramHandle: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

// A mock user ID for the public version
export function BusinessSettings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
        businessContext: '',
        whatsappNumber: '',
        facebookPage: '',
        facebookPageId: '',
        instagramHandle: '',
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        // Handle case where there is no user
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchSettings = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching settings:', error);
        } else if (data) {
          form.reset({
            businessContext: data.business_context || '',
            whatsappNumber: data.whatsapp_number || '',
            facebookPage: data.facebook_page_url || '',
            facebookPageId: data.facebook_page_id || '',
            instagramHandle: data.instagram_handle || '',
          });
        }
        setIsLoading(false);
      };
      fetchSettings();
    }
  }, [userId, form]);

  const handleSaveChanges = async (data: SettingsFormData) => {
    if (!userId) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          business_context: data.businessContext,
          whatsapp_number: data.whatsappNumber,
          facebook_page_url: data.facebookPage,
          facebook_page_id: data.facebookPageId,
          instagram_handle: data.instagramHandle,
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Settings Saved!',
        description: 'Your AI assistant has been updated with the new information.',
      });
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: 'Uh oh! Something went wrong.',
        description: 'Could not save your settings. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle>Business Settings</CardTitle>
                <CardDescription>Manage your business information and AI settings.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveChanges)}>
                <CardHeader>
                    <CardTitle>Business Settings</CardTitle>
                    <CardDescription>
                    This is the information your AI assistant will use to answer customer questions. Update it anytime.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="businessContext" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Business Context</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Paste your return policy, FAQ, or any other text you want the AI to know."
                                    className="min-h-[200px] font-mono text-xs"
                                    {...field}
                                />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="whatsappNumber" render={({ field }) => (
                        <FormItem>
                            <FormLabel>WhatsApp Business Number</FormLabel>
                            <FormControl><Input placeholder="+267 71 234 567 or +27 82 123 4567" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                     <FormField control={form.control} name="facebookPage" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Facebook Page URL</FormLabel>
                            <FormControl><Input placeholder="https://facebook.com/your-page" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="facebookPageId" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Facebook Page ID</FormLabel>
                            <FormControl><Input placeholder="e.g. 123456789012345" {...field} /></FormControl>
                             <FormDescription className="flex items-center gap-1 text-xs pt-1">
                                <HelpCircle className="h-3 w-3"/>
                                Find this in your Page's "About" &gt; "Page Transparency" section.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="instagramHandle" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instagram Handle</FormLabel>
                            <FormControl><Input placeholder="@yourhandle" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSaving || !form.formState.isDirty}>
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...</> : 'Save Changes'}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}
