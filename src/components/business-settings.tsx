
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';

const MOCK_BUSINESS_CONTEXT = `
Return Policy:

Our return window is 30 days for most items. Items must be unworn, in their original packaging, and with all tags attached. 
A full refund will be issued to the original payment method.

Electronics:
Electronics, such as headphones and cameras, have a 14-day return window. They must be in their original, unopened packaging. If the packaging is opened, a 15% restocking fee will apply. A valid receipt is required for all electronics returns.

Sale Items:
Items purchased on sale are final and cannot be returned or exchanged.
`;

export function BusinessSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState(MOCK_BUSINESS_CONTEXT);
  const { toast } = useToast();

  const handleSaveChanges = async () => {
    setIsLoading(true);
    // In a real app, you'd save this to your database
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({
        title: 'Settings Saved!',
        description: 'Your AI assistant has been updated with the new information.',
    });
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Business Context</CardTitle>
        <CardDescription>
          This is the information your AI assistant will use to answer customer questions. Update it anytime.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
            <Label htmlFor="business-context">Your Policy, FAQ, or Business Information</Label>
            <Textarea
                id="business-context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="min-h-[300px] font-mono text-xs"
                disabled={isLoading}
            />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveChanges} className="w-full" disabled={isLoading}>
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...</> : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
}
