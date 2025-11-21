
import { AppConfig } from '@/lib/app-config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, Bot, Camera, LayoutDashboard, Package, Sparkles, MessageCircle, Link as LinkIcon, LifeBuoy, Code } from 'lucide-react';
import Link from 'next/link';

const tools = [
    {
        title: "Analytics",
        description: "View return trends and get insights.",
        icon: <BarChart2 className="h-8 w-8 text-primary" />,
        href: "/analytics"
    },
    {
        title: "Process Returns",
        description: "Manually process a customer return.",
        icon: <Package className="h-8 w-8 text-primary" />,
        href: "/returns"
    },
    {
        title: "Visual Search",
        description: "Find products by uploading an image.",
        icon: <Camera className="h-8 w-8 text-primary" />,
        href: "/visual-search"
    },
    {
        title: "Policy AI",
        description: "Ask your customer-facing AI assistant.",
        icon: <Bot className="h-8 w-8 text-primary" />,
        href: "/policy-ai"
    },
    {
        title: "Support AI",
        description: "Ask us questions about this product.",
        icon: <LifeBuoy className="h-8 w-8 text-primary" />,
        href: "/support-ai"
    },
    {
        title: "Website Integration",
        description: "Embed the AI assistant on your website.",
        icon: <Code className="h-8 w-8 text-primary" />,
        href: "/website-integration"
    }
]

export default function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-8">
        <LayoutDashboard className="h-8 w-8" />
        <div>
            <h1 className="text-2xl font-semibold">Welcome Back!</h1>
            <p className="text-muted-foreground">Here's a quick overview of your business.</p>
        </div>
      </div>

      {/* Key Metrics & Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                    <span>AI Interactions</span>
                    <Sparkles className="h-5 w-5 text-primary" />
                </CardTitle>
                <CardDescription>This month so far</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">1,204</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Automated Tasks</CardTitle>
                <CardDescription>Returns & FAQs handled</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">87</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Time Saved</CardTitle>
                <CardDescription>Estimated hours this month</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">~15 <span className="text-lg font-normal">hrs</span></p>
            </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                    <span>WhatsApp Bot</span>
                    <MessageCircle className="h-5 w-5 text-primary" />
                </CardTitle>
                <CardDescription>Connection status for clients</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-md">
                     <span className="font-semibold text-destructive">Not Connected</span>
                     <Button size="sm">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Connect
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Tools Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
                 <Card key={tool.href} className="hover:shadow-lg hover:-translate-y-1 transition-all">
                    <CardHeader className="flex-row items-start gap-4">
                        {tool.icon}
                        <div>
                            <CardTitle>{tool.title}</CardTitle>
                            <CardDescription>{tool.description}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href={tool.href}>Open Tool</Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>

    </main>
  );
}
