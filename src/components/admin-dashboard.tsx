'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from './ui/badge';
import { PolicyQa } from './policy-qa';
import { getAdminPolicyAnswerStream } from '@/ai/flows/admin-qa-flow';
import { Button } from './ui/button';
import Link from 'next/link';
import { Cog } from 'lucide-react';

const mockBusinesses = [
    { name: 'The Awesome Shoe Co.', email: 'contact@awesomeshoe.co', status: 'Active', plan: 'Launch Partner' },
    { name: 'Kgosi Accounting', email: 'kgosi@kgosi-acc.com', status: 'Active', plan: 'Launch Partner' },
    { name: 'Digital Dreams Inc.', email: 'hello@digitaldreams.dev', status: 'Needs Setup', plan: 'Launch Partner' },
    { name: 'Gabs City Florist', email: 'flowers@gabsflorist.co.bw', status: 'Needs Setup', plan: 'Launch Partner' },
];

export function AdminDashboard() {
  return (
    <Tabs defaultValue="businesses">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="businesses">Manage Businesses</TabsTrigger>
        <TabsTrigger value="support-ai">Your Support AI</TabsTrigger>
      </TabsList>
      <TabsContent value="businesses">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Onboarded Businesses</CardTitle>
                <CardDescription>A list of all businesses that have signed up for Retail-Assist 3.0.</CardDescription>
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
                {mockBusinesses.map((business) => (
                  <TableRow key={business.email}>
                    <TableCell className="font-medium">{business.name}</TableCell>
                    <TableCell>{business.email}</TableCell>
                    <TableCell>{business.plan}</TableCell>
                    <TableCell>
                        <Badge variant={business.status === 'Active' ? 'default' : 'secondary'} className={business.status === 'Active' ? 'bg-green-600/20 text-green-700 dark:text-green-400' : ''}>
                            {business.status}
                        </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="support-ai">
        <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
                 <PolicyQa 
                    title="Your Support AI"
                    description="Ask questions about Retail-Assist 3.0 to help your customers."
                    qaStreamer={getAdminPolicyAnswerStream}
                 />
            </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
