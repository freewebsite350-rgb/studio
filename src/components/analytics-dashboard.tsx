
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

interface AnalyticsData {
  id: string;
  event: string;
  created_at: string;
}

export function AnalyticsDashboard() {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from<AnalyticsData>('analytics')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setAnalytics(data || []);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to realtime changes
    const subscription = supabase
      .from(analytics:user_id=eq.${user.id})
      .on('INSERT', payload => {
        setAnalytics(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [user?.id]);

  if (loading) return <Loader2 className="animate-spin w-6 h-6" />;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {analytics.length === 0 && <p>No analytics data yet.</p>}
        {analytics.map(a => (
          <div key={a.id} className="border-b py-2">
            <p><strong>Event:</strong> {a.event}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(a.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}