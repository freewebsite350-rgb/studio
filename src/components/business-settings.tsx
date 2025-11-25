'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase/client';

interface BusinessSettings {
  businessName: string;
  contactEmail: string;
  description: string;
}

export function BusinessSettings() {
  const { toast } = useToast();
  const { user } = useUser(); // custom hook to get logged-in user
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchSettings(user.id);
  }, [user?.id]);

  const fetchSettings = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from<BusinessSettings>('businesses')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setSettings(data || null);
    } catch (err: any) {
      toast({
        title: 'Error fetching business settings',
        variant: 'destructive',
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async () => {
    if (!settings || !user?.id) return;

    try {
      const { error } = await supabase
        .from('businesses')
        .update(settings)
        .eq('user_id', user.id);

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
        <CardTitle>Business Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Business Name</label>
          <Input
            value={settings?.businessName || ''}
            onChange={e =>
              setSettings({ ...settings!, businessName: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact Email</label>
          <Input
            value={settings?.contactEmail || ''}
            onChange={e =>
              setSettings({ ...settings!, contactEmail: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Input
            value={settings?.description || ''}
            onChange={e =>
              setSettings({ ...settings!, description: e.target.value })
            }
          />
        </div>

        <Button onClick={updateSettings}>Save Changes</Button>
      </CardContent>
    </Card>
  );
}