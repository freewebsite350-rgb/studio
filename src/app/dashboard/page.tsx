import { AppConfig } from '@/lib/app-config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, Bot, Camera, LayoutDashboard, Package, Sparkles, MessageCircle, Link as LinkIcon, LifeBuoy } from 'lucide-react';
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
    }
]

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

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

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
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
      </div>

      {/* Connection Status Section */}
       <div>
        <h2 className="text-xl font-semibold mb-4">Your AI Channels</h2>
         <div className="grid gap-4 md:grid-cols-3 mb-8">
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
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                        <span>Facebook Bot</span>
                        <FacebookIcon className="h-5 w-5 text-primary" />
                    </CardTitle>
                    <CardDescription>Connection status for Messenger</CardDescription>
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
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                        <span>Instagram Bot</span>
                        <InstagramIcon className="h-5 w-5 text-primary" />
                    </CardTitle>
                    <CardDescription>Connection status for DMs</CardDescription>
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
      </div>


      {/* Tools Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
