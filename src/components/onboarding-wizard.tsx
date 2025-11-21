
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, BadgeCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import Link from 'next/link';
import { Textarea } from './ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { useAuth, useFirestore } from '@/firebase/provider';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const step1Schema = z.object({
  businessName: z.string().min(1, 'Business name is required.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  whatsappNumber: z.string().min(1, 'WhatsApp number is required.'),
  facebookPage: z.string().optional(),
  instagramHandle: z.string().optional(),
});

const step2Schema = z.object({
    businessContext: z.string().min(20, 'Please provide some context for your business.'),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

type Step = 1 | 2 | 3 | 4;

export function OnboardingWizard() {
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Step1Data & Step2Data>>({});
  
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
        businessName: '',
        email: '',
        password: '',
        whatsappNumber: '',
        facebookPage: '',
        instagramHandle: '',
    }
  });

  const step2Form = useForm<Step2Data>({
      resolver: zodResolver(step2Schema),
      defaultValues: {
          businessContext: '',
      }
  });


  const progressValues = { 1: 0, 2: 33, 3: 66, 4: 100 };

  const handleStep1Submit = (data: Step1Data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleStep2Submit = (data: Step2Data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    if (!auth || !firestore) {
        toast({
            variant: "destructive",
            title: "Firebase not initialized",
            description: "Please try again later.",
        });
        setIsLoading(false);
        return;
    }
    
    const finalData = formData as Step1Data & Step2Data;

    try {
        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, finalData.email, finalData.password);
        const user = userCredential.user;

        // 2. Save user profile to Firestore
        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, {
            uid: user.uid,
            email: finalData.email,
            businessName: finalData.businessName,
            businessContext: finalData.businessContext,
            whatsappNumber: finalData.whatsappNumber,
            facebookPage: finalData.facebookPage || '',
            instagramHandle: finalData.instagramHandle || '',
            createdAt: serverTimestamp(),
        });
        
        // Don't need to handle features yet as they are not stored in the DB
        setStep(4);
    } catch (error: any) {
        console.error("Onboarding error:", error);
        toast({
            variant: "destructive",
            title: "Onboarding Failed",
            description: error.message || "An unexpected error occurred. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
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
                <Button className="w-full" onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
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

        {step === 1 && (
            <Form {...step1Form}>
                <form onSubmit={step1Form.handleSubmit(handleStep1Submit)}>
                    <CardContent className="space-y-4">
                        <FormField control={step1Form.control} name="businessName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Name</FormLabel>
                                <FormControl><Input placeholder="e.g., The Awesome Shoe Co." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={step1Form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={step1Form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl><Input type="password" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={step1Form.control} name="whatsappNumber" render={({ field }) => (
                             <FormItem>
                                <FormLabel>WhatsApp Business Number</FormLabel>
                                <FormControl><Input placeholder="+267 71 234 567 or +27 82 123 4567" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={step1Form.control} name="facebookPage" render={({ field }) => (
                             <FormItem>
                                <FormLabel>Facebook Page (Optional)</FormLabel>
                                <FormControl><Input placeholder="e.g., facebook.com/AwesomeShoes" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={step1Form.control} name="instagramHandle" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Instagram Handle (Optional)</FormLabel>
                                <FormControl><Input placeholder="e.g., @AwesomeShoes" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Create Account & Continue</Button>
                    </CardFooter>
                </form>
            </Form>
        )}
        
        {step === 2 && (
            <Form {...step2Form}>
                <form onSubmit={step2Form.handleSubmit(handleStep2Submit)}>
                    <CardContent>
                        <FormField control={step2Form.control} name="businessContext" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Policy or FAQ</FormLabel>
                                <FormControl>
                                    <Textarea 
                                        placeholder="Paste your return policy, store hours, FAQ, or any other text you want the AI to know."
                                        className="min-h-[200px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading} className="w-full">
                            Save & Continue
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        )}

        {step === 3 && (
            <>
            <CardContent>
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
            </CardContent>
            <CardFooter>
                <Button onClick={handleFinalSubmit} disabled={isLoading} className="w-full">
                     {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finishing Up...</> : 'Finish Setup'}
                </Button>
            </CardFooter>
            </>
        )}
    </Card>
  );
}
