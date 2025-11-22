
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { getPolicyAnswerStream } from '@/ai/flows/policy-qa-flow';
import { useFirestore } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

// A generic input type that works for both policy and admin QA
type QaInput = {
    customer_question: string;
    business_context?: string;
    userId?: string;
}

type QAFunction = (input: QaInput) => Promise<ReadableStream<any>>;

interface PolicyQaProps {
    title?: string;
    description?: string;
    qaStreamer?: QAFunction;
    placeholder?: string;
}

// A mock user ID for the public version
const MOCK_USER_ID = "public_user_id";

export function PolicyQa({ title, description, qaStreamer = getPolicyAnswerStream, placeholder }: PolicyQaProps) {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [businessContext, setBusinessContext] = useState<string | null>(null);

    const firestore = useFirestore();

    // Check if the provided streamer function is the admin one.
    const isAdminStreamer = qaStreamer.name.includes('getAdmin');

    // Fetch the business context for the mock user if it's not the admin streamer
    useEffect(() => {
        if (firestore && !isAdminStreamer) {
            const userDocRef = doc(firestore, 'users', MOCK_USER_ID);
            const unsubscribe = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    setBusinessContext(doc.data().businessContext || '');
                } else {
                    setBusinessContext('');
                }
            });
            return () => unsubscribe();
        }
    }, [firestore, isAdminStreamer]);


    const handleAsk = async () => {
        if (!question.trim()) return;

        setIsLoading(true);
        setAnswer('');

        try {
            // For non-admin, wait until we have a context from Firestore.
            if (!isAdminStreamer && businessContext === null) {
                setAnswer('Initializing your AI assistant... Please wait a moment and try again.');
                setIsLoading(false);
                return;
            }

            const input: QaInput = {
                customer_question: question,
            };

            // Only add business_context and userId if they are relevant
            if (!isAdminStreamer) {
                input.business_context = businessContext!;
                input.userId = MOCK_USER_ID;
            }

            const stream = await qaStreamer(input);
            
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
    
    const isReady = isAdminStreamer || businessContext !== null;


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
