'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle, BadgeCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import Link from 'next/link';
import { Textarea } from './ui/textarea';

type Step = 1 | 2 | 3 | 4;

export function OnboardingWizard() {
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const progressValues = { 1: 0, 2: 33, 3: 66, 4: 100 };

  const handleNextStep = () => {
    if (step === 1) {
        if (!email.trim()) {
            setError('Email address is required.');
            return;
        }
        setError(null);
    }
    if (step < 4) {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  const handleSaveContext = async () => {
    setIsLoading(true);
    // In a real app, you'd save this context to the user's profile in the DB
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    handleNextStep();
  };

  if (step === 4) {
      return (
        <Card className="w-full shadow-lg border-2 border-primary/20 bg-primary/5">
             <CardHeader className="items-center text-center">
                <BadgeCheck className="h-16 w-16 text-green-500 mb-4" />
                <CardTitle className="text-3xl">Welcome to your Dashboard!</CardTitle>
                <CardDescription>Your setup is complete. You can now manage your business.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center">
                    <Alert variant="default" className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400 max-w-sm">
                        <BadgeCheck className="h-4 w-4 !text-green-500" />
                        <AlertTitle>Status: Active</AlertTitle>
                        <AlertDescription>
                            Your AI agent is now active and ready to assist your customers.
                        </AlertDescription>
                    </Alert>
                </div>
            </CardContent>
             <CardFooter className="flex-col gap-4">
                <Link href="/" className="w-full">
                    <Button className="w-full">Go to Dashboard</Button>
                </Link>
            </CardFooter>
        </Card>
      )
  }

  return (
    <Card className="w-full shadow-lg">
        <CardHeader>
            <Progress value={progressValues[step]} className="mb-4 h-2" />
            {step === 1 && <CardTitle>Step 1: Create Your Account</CardTitle>}
            {step === 2 && <CardTitle>Step 2: Provide Business Context</CardTitle>}
            {step === 3 && <CardTitle>Step 3: Activate Features</CardTitle>}
            {step === 1 && <CardDescription>Start by creating a secure account for your business.</CardDescription>}
            {step === 2 && <CardDescription>Paste your return policy or any other information for the AI.</CardDescription>}
            {step === 3 && <CardDescription>Choose the initial features you want to enable.</CardDescription>}
        </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input id="business-name" placeholder="e.g., The Awesome Shoe Co." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
               {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="business-context">Business Policy or FAQ</Label>
                <Textarea 
                    id="business-context" 
                    placeholder="Paste your return policy, store hours, FAQ, or any other text you want the AI to know."
                    className="min-h-[200px]"
                />
            </div>
          </div>
        )}
        {step === 3 && (
            <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-medium mb-4">Configuration Checklist</h3>
                <div className="flex items-center space-x-3">
                    <Checkbox id="auto-returns" defaultChecked />
                    <Label htmlFor="auto-returns" className="flex flex-col">
                        <span>Enable Automated Returns</span>
                        <span className="text-xs text-muted-foreground">Allow AI to automatically process eligible returns.</span>
                    </Label>
                </div>
                 <div className="flex items-center space-x-3">
                    <Checkbox id="visual-search" defaultChecked />
                    <Label htmlFor="visual-search" className="flex flex-col">
                        <span>Enable Visual Search</span>
                         <span className="text-xs text-muted-foreground">Let customers search your products by uploading a photo.</span>
                    </Label>
                </div>
                 <div className="flex items-center space-x-3">
                    <Checkbox id="policy-ai" defaultChecked />
                    <Label htmlFor="policy-ai" className="flex flex-col">
                        <span>Enable Policy/FAQ AI</span>
                         <span className="text-xs text-muted-foreground">Let customers ask questions about your business.</span>
                    </Label>
                </div>
            </div>
        )}
      </CardContent>
      <CardFooter>
        {step === 1 && <Button onClick={handleNextStep} className="w-full">Create Account</Button>}
        {step === 2 && <Button onClick={handleSaveContext} disabled={isLoading} className="w-full">
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save & Continue'}
        </Button>}
        {step === 3 && <Button onClick={handleNextStep} className="w-full">Finish Setup</Button>}
      </CardFooter>
    </Card>
  );
}
