'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

interface AdminSettings {
  supportAIEnabled: boolean;
  greetingMessage: string;
}

export function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();

    // Listen for realtime updates
    const subscription = supabase
      .from('admin')
      .on('UPDATE', payload => {
        setSettings(payload.new as AdminSettings);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from<AdminSettings>('admin')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data || null);
    } catch (err: any) {
      toast({
        title: 'Error fetching settings',
        variant: 'destructive',
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async () => {
    if (!settings) return;
    try {
      const { error } = await supabase
        .from('admin')
        .update(settings)
        .eq('id', 1); // assuming single row with id=1

      if (error) throw error;

      toast({ title: 'Settings updated successfully' });
    } catch (err: any) {
      toast({
        title: 'Error updating settings',
        variant: 'destructive',
        description: err.message,
      });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Admin Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Support AI Enabled</label>
          <input
            type="checkbox"
            checked={settings?.supportAIEnabled}
            onChange={e =>
              setSettings({ ...settings!, supportAIEnabled: e.target.checked })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Greeting Message</label>
          <Input
            value={settings?.greetingMessage || ''}
            onChange={e =>
              setSettings({ ...settings!, greetingMessage: e.target.value })
            }
          />
        </div>

        <Button onClick={updateSettings}>Save Changes</Button>
      </CardContent>
    </Card>
  );
}