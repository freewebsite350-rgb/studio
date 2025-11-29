'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/app/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { getPolicyAnswerStream } from '@/lib/ai/flows/policy-qa-flow'; // Assuming this is the correct path after refactoring

// A generic input type that works for both policy and admin QA
type QaInput = {
    customer_question: string;
    userId: string; // userId is now mandatory and passed from the server component
}

type QAFunction = (input: QaInput) => Promise<ReadableStream<any>>;

interface PolicyQaProps {
    title?: string;
    description?: string;
    qaStreamer?: QAFunction;
    placeholder?: string;
    userId: string; // Pass userId as a prop
}

export function PolicyQa({ title, description, qaStreamer = getPolicyAnswerStream, placeholder, userId }: PolicyQaProps) {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAsk = useCallback(async () => {
        if (!question.trim()) return;

        setIsLoading(true);
        setAnswer('');

        try {
            const input: QaInput = {
                customer_question: question,
                userId: userId,
            };

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
    }, [question, qaStreamer, userId]);
    
    const isReady = true; // Context fetching is now handled in the flow or server component


    return (
        <Card className="w-full shadow-lg border-2 border-transparent focus-within:border-primary/50 transition-colors duration-300">
            <CardHeader>
              <CardTitle>{title || 'Policy Q&A'}</CardTitle>
              <CardDescription>{description || 'Ask a question about your business policies.'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Textarea 
                        id="question" 
                        name="question" 
                        placeholder={placeholder || "e.g., How do I return an electronic item?"}
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
