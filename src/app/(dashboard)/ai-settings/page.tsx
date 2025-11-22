'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function AiSettingsPage() {
  const [systemPrompt, setSystemPrompt] = useState('');
  const { user } = useUser();
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSystemPrompt = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('ai_settings')
          .select('system_prompt')
          .eq('user_id', user.id)
          .single();
        if (data) {
          setSystemPrompt(data.system_prompt);
        }
      }
    };
    fetchSystemPrompt();
  }, [user, supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const { error } = await supabase
        .from('ai_settings')
        .upsert({ user_id: user.id, system_prompt: systemPrompt });
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
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>AI Settings</CardTitle>
            <CardDescription>
              Configure the system prompt for your business's AI assistant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="system-prompt">Business Description</Label>
                  <Textarea
                    id="system-prompt"
                    placeholder="e.g., We are a small coffee shop that specializes in artisanal pour-over coffee..."
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
