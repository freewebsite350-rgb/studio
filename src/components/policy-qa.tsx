
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { getPolicyAnswerStream, PolicyQaInput } from '@/ai/flows/policy-qa-flow';
import { useUser, useFirestore } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

type QAFunction = (input: PolicyQaInput) => Promise<ReadableStream<any>>;

interface PolicyQaProps {
    title?: string;
    description?: string;
    qaStreamer?: QAFunction;
    placeholder?: string;
}

export function PolicyQa({ title, description, qaStreamer = getPolicyAnswerStream, placeholder }: PolicyQaProps) {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [businessContext, setBusinessContext] = useState<string | null>(null);

    const user = useUser();
    const firestore = useFirestore();

    // Fetch the business context for the logged-in user
    useEffect(() => {
        if (user && firestore && !qaStreamer.name.includes('getAdmin')) {
            const userDocRef = doc(firestore, 'users', user.uid);
            const unsubscribe = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    setBusinessContext(doc.data().businessContext || '');
                } else {
                    // This can happen if the user doc isn't created yet
                    // or if the user is not the business owner.
                    setBusinessContext('');
                }
            });
            return () => unsubscribe();
        }
    }, [user, firestore, qaStreamer]);


    const handleAsk = async () => {
        if (!question.trim() || !user) return;

        setIsLoading(true);
        setAnswer('');

        try {
            // If it's the admin streamer, it doesn't need a business context.
            // Otherwise, wait until we have a context from Firestore.
            if (!qaStreamer.name.includes('getAdmin') && businessContext === null) {
                setAnswer('Initializing your AI assistant... Please wait a moment and try again.');
                setIsLoading(false);
                return;
            }

            const stream = await qaStreamer({ 
                customer_question: question,
                business_context: businessContext!, // Can be empty string, but must be provided
                userId: user.uid,
            });
            
            const reader = stream.getReader();
            const decoder = new TextDecoder();
            let accumulatedAnswer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                accumulatedAnswer += chunk;
                setAnswer(accumulatedAnswer);
            }

        } catch (error) {
            console.error(error);
            setAnswer('Sorry, I encountered an error trying to answer your question.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Disable form if it's not the admin bot and the context is not yet loaded.
    const isReady = qaStreamer.name.includes('getAdmin') || businessContext !== null;


    return (
        <Card className="w-full shadow-lg border-2 border-transparent focus-within:border-primary/50 transition-colors duration-300">
            <CardHeader>
              <CardTitle>{title || 'Policy Q&A'}</CardTitle>
              <CardDescription>{description || 'Ask a question about our return policy.'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Input 
                        id="question" 
                        name="question" 
                        placeholder={!isReady ? "Loading your AI..." : (placeholder || "e.g., How do I return an electronic item?")}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isLoading && isReady && handleAsk()}
                        disabled={isLoading || !isReady}
                    />
                </div>
                {isLoading && !answer && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Thinking...</span>
                    </div>
                )}
                {answer && (
                    <div className="p-4 bg-secondary/50 rounded-md border border-border">
                        <p className="text-sm text-foreground whitespace-pre-wrap">{answer}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={handleAsk} className="w-full" disabled={isLoading || !question.trim() || !isReady}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Thinking...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Ask AI
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
