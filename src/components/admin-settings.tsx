
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const settingsSchema = z.object({
    adminBusinessContext: z.string().min(20, 'Please provide some context for the support AI.'),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const ADMIN_CONFIG_ID = 1; // Assuming a single row for admin config

export function AdminSettings() {
  const { toast } = useToast();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
        adminBusinessContext: '',
    }
  });

  useEffect(() => {
    const fetchAdminContext = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('admin')
        .select('business_context')
        .eq('id', ADMIN_CONFIG_ID)
        .single();

      if (error) {
        console.error('Error fetching admin context:', error);
      } else if (data) {
        form.reset({
          adminBusinessContext: data.business_context || '',
        });
      }
      setIsLoading(false);
    };

    fetchAdminContext();
  }, [supabase, form]);

  const handleSaveChanges = async (data: SettingsFormData) => {
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('admin')
        .update({
          business_context: data.adminBusinessContext,
        })
        .eq('id', ADMIN_CONFIG_ID);

      if (error) throw error;

      toast({
        title: 'Settings Saved!',
        description: 'The admin support AI has been updated with the new information.',
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
                <CardTitle>Support AI Settings</CardTitle>
                <CardDescription>Manage the business context your Support AI uses to answer questions about your product.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center h-64">
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
                    <CardTitle>Support AI Settings</CardTitle>
                    <CardDescription>
                        This is the information your internal Support AI will use to answer your questions about how Retail-Assist 3.0 works.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="adminBusinessContext" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Support AI Business Context</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Paste the product description, features, pricing, and any other text you want the support AI to know."
                                    className="min-h-[300px] font-mono text-xs"
                                    {...field}
                                />
                            </FormControl>
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
