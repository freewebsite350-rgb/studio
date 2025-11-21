import WebsiteIntegrationClient from '@/components/WebsiteIntegrationClient';

export default function Page() {
  // Server component that delegates all Firebase/client work to a client component
  return <WebsiteIntegrationClient />;
}