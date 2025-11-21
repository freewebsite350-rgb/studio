
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const mockReturnData: any[] = [];
const returnsByReason: any[] = [];
const returnTrend: any[] = [];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function AnalyticsDashboard() {
    const totalReturns = mockReturnData.length;
    
    const mostReturnedItem = mockReturnData.reduce((acc, curr) => {
        acc[curr.product] = (acc[curr.product] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const topItem = Object.entries(mostReturnedItem).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const topReturnReason = returnsByReason.sort((a,b) => b.returns - a.returns)[0]?.reason || 'N/A';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Returns</CardTitle>
          <CardDescription>Total number of returns this month.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalReturns}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top Return Reason</CardTitle>
          <CardDescription>Most frequent reason for returns.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{topReturnReason}</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Most Returned Item</CardTitle>
          <CardDescription>Product with the highest return rate.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{topItem}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Refunds Processed</CardTitle>
           <CardDescription>Total value of refunds issued.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">$0</p>
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Returns by Reason</CardTitle>
          <CardDescription>A breakdown of return reasons.</CardDescription>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                {returnsByReason.length > 0 ? (
                    <PieChart>
                        <Pie
                            data={returnsByReason}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="returns"
                            nameKey="reason"
                        >
                            {returnsByReason.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        No return data available.
                    </div>
                )}
            </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Return Trend</CardTitle>
          <CardDescription>Return counts over the past weeks.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {returnTrend.length > 0 ? (
                <BarChart data={returnTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="returns" fill="hsl(var(--primary))" />
                </BarChart>
            ) : (
                 <div className="flex items-center justify-center h-full text-muted-foreground">
                    No trend data available.
                </div>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
