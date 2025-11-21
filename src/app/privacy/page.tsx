import { AppConfig } from '@/lib/app-config';

export default function PrivacyPolicyPage() {
  return (
    <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto prose dark:prose-invert">
        <h1>Privacy Policy for {AppConfig.appName}</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <p>
          Welcome to {AppConfig.appName}. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We may collect information about you in a variety of ways. The information we may collect via the Application includes:
        </p>
        <ul>
          <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and business information that you voluntarily give to us when you register with the Application.</li>
          <li><strong>Facebook Messenger Data:</strong> When you connect your Facebook Page, we receive messages and user information from users who interact with your page. This data is processed to provide responses via our AI service and is subject to Facebook's policies. We only use this data to provide the service and do not share it with third parties.</li>
        </ul>

        <h2>2. Use of Your Information</h2>
        <p>
          Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:
        </p>
        <ul>
          <li>Create and manage your account.</li>
          <li>Provide AI-powered customer support on your behalf.</li>
          <li>Generate analytics about the usage of the AI assistant.</li>
          <li>Improve the functionality of the application.</li>
        </ul>

        <h2>3. Security of Your Information</h2>
        <p>
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </p>

        <h2>4. Contact Us</h2>
        <p>
          If you have questions or comments about this Privacy Policy, please contact us.
        </p>
      </div>
    </main>
  );
}
