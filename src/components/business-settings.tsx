
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase/provider';
import { doc, onSnapshot, setDoc, serverTimestamp, DocumentData } from 'firebase/firestore';
import { Input } from './ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const settingsSchema = z.object({
    businessContext: z.string().min(20, 'Please provide some context for your business.'),
    whatsappNumber: z.string().optional(),
    facebookPage: z.string().optional(),
    instagramHandle: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export function BusinessSettings() {
  const { toast } = useToast();
  const user = useUser();
  const firestore = useFirestore();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
        businessContext: '',
        whatsappNumber: '',
        facebookPage: '',
        instagramHandle: '',
    }
  });

  useEffect(() => {
    if (user && firestore) {
      setIsLoading(true);
      const userDocRef = doc(firestore, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as DocumentData;
          form.reset({
              businessContext: data.businessContext || '',
              whatsappNumber: data.whatsappNumber || '',
              facebookPage: data.facebookPage || '',
              instagramHandle: data.instagramHandle || '',
          });
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user, firestore, form]);

  const handleSaveChanges = async (data: SettingsFormData) => {
    if (!user || !firestore) return;
    setIsSaving(true);

    const userDocRef = doc(firestore, 'users', user.uid);
    try {
        await setDoc(userDocRef, { 
            ...data,
            updatedAt: serverTimestamp() 
        }, { merge: true });

        toast({
            title: 'Settings Saved!',
            description: 'Your AI assistant has been updated with the new information.',
        });
    } catch(e) {
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

    