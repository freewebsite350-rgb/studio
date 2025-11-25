'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from './ui/badge';
import { PolicyQa } from './policy-qa';
import { getAdminPolicyAnswerStream } from '@/ai/flows/admin-qa-flow';
import { Button } from './ui/button';
import Link from 'next/link';
import { Cog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Business {
  name: string;
  email: string;
  status: string;
  plan: string;
}

export function AdminDashboard() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user || user.user_metadata?.role !== 'admin') {
        toast({ title: 'Access Denied', description: 'You must be an admin to view this page', variant: 'destructive' });
        router.push('/login');
        return;
      }

      fetchBusinesses();
    };

    const fetchBusinesses = async () => {
      try {
        const { data, error } = await supabase.from('businesses').select('*'); // table: businesses
        if (error) throw error;
        setBusinesses(data);
      } catch (err: any) {
        toast({ title: 'Error', description: err.message || 'Failed to fetch businesses', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router, toast]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <Tabs defaultValue="businesses">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="businesses">Manage Businesses</TabsTrigger>
        <TabsTrigger value="support-ai">Your Support AI</TabsTrigger>
      </TabsList>

      {/* Businesses Table */}
      <TabsContent value="businesses">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Onboarded Businesses</CardTitle>
              <CardDescription>All businesses signed up for your platform.</CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin/settings">
                <Cog className="mr-2 h-4 w-4" />
                Admin Settings
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Subscription Plan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((b) => (
                  <TableRow key={b.email}>
                    <TableCell className="font-medium">{b.name}</TableCell>
                    <TableCell>{b.email}</TableCell>
                    <TableCell>{b.plan}</TableCell>
                    <TableCell>
                      <Badge
                        variant={b.status === 'Active' ? 'default' : 'secondary'}
                        className={b.status === 'Active' ? 'bg-green-600/20 text-green-700 dark:text-green-400' : ''}
                      >
                        {b.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Support AI */}
      <TabsContent value="support-ai">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <PolicyQa
              title="Your Support AI"
              description="Ask questions about your platform to assist your clients."
              qaStreamer={getAdminPolicyAnswerStream}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}