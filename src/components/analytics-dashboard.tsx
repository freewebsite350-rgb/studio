
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, onSnapshot, query, DocumentData, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';
import { subWeeks, format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

type Interaction = {
    id: string;
    type: string;
    createdAt: Timestamp;
    details: Record<string, any>;
};

export function AnalyticsDashboard() {
    const user = useUser();
    const firestore = useFirestore();
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && firestore) {
            setIsLoading(true);
            const interactionsQuery = query(collection(firestore, 'users', user.uid, 'interactions'));
            const unsubscribe = onSnapshot(interactionsQuery, (snapshot) => {
                const interactionsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                } as Interaction));
                setInteractions(interactionsData);
                setIsLoading(false);
            }, (error) => {
                console.error("Error fetching interactions: ", error);
                setIsLoading(false);
            });

            return () => unsubscribe();
        } else if (!user) {
            setIsLoading(false);
        }
    }, [user, firestore]);

    const totalInteractions = interactions.length;
    
    const interactionsByType = interactions.reduce((acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const interactionsByTypeData = Object.entries(interactionsByType).map(([type, count]) => ({
        name: type.replace('_', ' '),
        value: count,
    }));

    const interactionTrend = Array.from({ length: 4 }).map((_, i) => {
        const weekDate = subWeeks(new Date(), 3 - i);
        const start = startOfWeek(weekDate);
        const end = endOfWeek(weekDate);
        
        const count = interactions.filter(interaction => {
            const interactionDate = interaction.createdAt.toDate();
            return isWithinInterval(interactionDate, { start, end });
        }).length;
        
        return {
            week: `Week of ${format(start, 'MMM d')}`,
            interactions: count
        };
    });
    

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total AI Interactions</CardTitle>
          <CardDescription>Total number of AI interactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalInteractions}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Most Frequent Interaction</CardTitle>
          <CardDescription>Most common type of AI usage.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold capitalize">
            {interactionsByTypeData.sort((a,b) => b.value - a.value)[0]?.name || 'N/A'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Time Saved (Est.)</CardTitle>
           <CardDescription>Estimated time saved by automation.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">~{Math.round(totalInteractions * 0.5)} <span className="text-lg font-normal">mins</span></p>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Interactions by Type</CardTitle>
          <CardDescription>A breakdown of AI interaction types.</CardDescription>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                {interactionsByTypeData.length > 0 ? (
                    <PieChart>
                        <Pie
                            data={interactionsByTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                        >
                            {interactionsByTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        No interaction data available.
                    </div>
                )}
            </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Interaction Trend</CardTitle>
          <CardDescription>Interaction counts over the past 4 weeks.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {interactionTrend.some(d => d.interactions > 0) ? (
                <BarChart data={interactionTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="interactions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            ) : (
                 <div className="flex items-center justify-center h-full text-muted-foreground">
                    No trend data available yet.
                </div>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
