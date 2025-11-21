'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import type { State } from '@/app/actions';
import { initiateReturn } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

const initialState: State = { message: '', status: undefined, errors: undefined };

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                </>
            ) : (
                'Initiate Return'
            )}
        </Button>
    );
}

export function ReturnForm() {
    const [state, formAction] = useFormState(initiateReturn, initialState);
    const formRef = useRef<HTMLFormElement>(null);
    const { pending } = useFormStatus();
    
    useEffect(() => {
        if (state?.status === 'SUCCESS') {
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <Card className="w-full shadow-lg border-2 border-transparent focus-within:border-primary/50 transition-colors duration-300">
            <CardHeader>
              <CardTitle>Return Request</CardTitle>
              <CardDescription>Enter your order details to start a return.</CardDescription>
            </CardHeader>
            <form action={formAction} ref={formRef}>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="orderId">Order ID</Label>
                        <Input id="orderId" name="orderId" placeholder="e.g., 123-4567890-1234567" required aria-describedby="orderId-error" />
                        {state?.errors?.orderId && (
                            <p id="orderId-error" className="text-sm font-medium text-destructive">
                                {state.errors.orderId[0]}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Return</Label>
                        <Textarea id="reason" name="reason" placeholder="Please describe the reason for your return in detail." required rows={4} aria-describedby="reason-error" />
                        {state?.errors?.reason && (
                            <p id="reason-error" className="text-sm font-medium text-destructive">
                                {state.errors.reason[0]}
                            </p>
                        )}
                    </div>
                    
                    {!pending && state?.message && (state?.status === 'SUCCESS' || (state?.status === 'ERROR' && !state.errors)) && (
                        <Alert variant={state.status === 'SUCCESS' ? 'default' : 'destructive'} className={`mt-4 animate-in fade-in-50 ${state.status === 'SUCCESS' ? 'bg-primary/10 border-primary/20 text-primary-foreground' : ''}`}>
                            {state.status === 'SUCCESS' ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <XCircle className="h-4 w-4" />}
                            <AlertTitle>{state.status === 'SUCCESS' ? 'Success!' : 'Error'}</AlertTitle>
                            <AlertDescription className={state.status === 'SUCCESS' ? 'text-primary/90' : ''}>
                                {state.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    );
}
