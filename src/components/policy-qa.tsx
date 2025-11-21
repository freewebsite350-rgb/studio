'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { getPolicyAnswerStream } from '@/ai/flows/policy-qa-flow';

export function PolicyQa() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAsk = async () => {
        if (!question.trim()) return;

        setIsLoading(true);
        setAnswer('');

        try {
            const stream = await getPolicyAnswerStream({ customer_question: question });
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

    return (
        <Card className="w-full shadow-lg border-2 border-transparent focus-within:border-primary/50 transition-colors duration-300">
            <CardHeader>
              <CardTitle>Policy Q&A</CardTitle>
              <CardDescription>Ask a question about our return policy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Input 
                        id="question" 
                        name="question" 
                        placeholder="e.g., What's the return window for electronics?" 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleAsk()}
                        disabled={isLoading}
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
                <Button onClick={handleAsk} className="w-full" disabled={isLoading || !question.trim()}>
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
