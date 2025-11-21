
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const embedCode = `<script 
  src="https://www.sambizai.com/widget.js" 
  data-business-id="YOUR_UNIQUE_BUSINESS_ID" 
  defer>
</script>`;

export function WebsiteIntegration() {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode.replace("YOUR_UNIQUE_BUSINESS_ID", "xyz-123-abc"));
    setHasCopied(true);
    toast({
      title: 'Code Copied!',
      description: 'The embed code has been copied to your clipboard.',
    });
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Embed on Your Website</CardTitle>
        <CardDescription>
          Copy and paste this code snippet into your website's HTML just before the closing 
          <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{'</body>'}</code> tag.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Textarea
            readOnly
            value={embedCode}
            className="font-mono text-xs min-h-[150px] bg-secondary/50 pr-12"
            aria-label="Embeddable code snippet"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleCopy}
          >
            {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
