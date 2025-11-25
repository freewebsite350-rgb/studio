
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function AiSettingsPage() {
  const [systemPrompt, setSystemPrompt] = useState('');
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_settings')
        .select('system_prompt')
        .eq('user_id', user.id)
        .single();

      if (data) setSystemPrompt(data.system_prompt);
    };

    fetchSettings();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const { error } = await supabase.from('ai_settings').upsert({
      user_id: user.id,
      system_prompt: systemPrompt,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'There was an error updating your settings.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Your settings have been updated.',
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>AI Settings</CardTitle>
            <CardDescription>Configure your business AI assistant.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Business Description</Label>
                  <Textarea
                    placeholder="Describe your business..."
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                  />
                </div>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}