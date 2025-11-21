
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { doc, onSnapshot, setDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export function BusinessSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState('');
  const [initialContext, setInitialContext] = useState('');
  const { toast } = useToast();
  const user = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    if (user && firestore) {
      const userDocRef = doc(firestore, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setContext(data.businessContext || '');
          setInitialContext(data.businessContext || '');
        }
      });
      return () => unsubscribe();
    }
  }, [user, firestore]);

  const handleSaveChanges = async () => {
    if (!user || !firestore) return;
    setIsLoading(true);

    const userDocRef = doc(firestore, 'users', user.uid);
    try {
        await setDoc(userDocRef, { 
            businessContext: context,
            updatedAt: serverTimestamp() 
        }, { merge: true });

        toast({
            title: 'Settings Saved!',
            description: 'Your AI assistant has been updated with the new information.',
        });
    } catch(e) {
        console.error(e);
        toast({
            variant: "destructive",
            title: 'Uh oh! Something went wrong.',
            description: 'Could not save your settings. Please try again.',
        });
    } finally {
        setIsLoading(false);
    }
  };

  const hasChanges = context !== initialContext;

  if (!user) {
    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle>Business Context</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </CardContent>
        </Card>
    );
  }

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
        <Button onClick={handleSaveChanges} className="w-full" disabled={isLoading || !hasChanges}>
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...</> : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
}
