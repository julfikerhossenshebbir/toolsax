import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Toolsax',
    description: 'Privacy Policy for Toolsax.',
};


export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
          <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="font-semibold text-lg">1. Introduction</h3>
          <p>
            Welcome to Toolsax. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
          <h3 className="font-semibold text-lg">2. Information We Collect</h3>
          <p>
            We may collect information about you in a variety of ways. The information we may collect on the Site includes:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Personal Data:</strong> We do not collect any personal data unless you voluntarily provide it to us through our contact form.</li>
            <li><strong>Usage Data:</strong> We may automatically collect usage data (such as your IP address, browser type, pages visited) to improve our service.</li>
          </ul>
          <h3 className="font-semibold text-lg">3. Use of Your Information</h3>
          <p>
            Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to monitor usage, analyze trends, and improve the user experience.
          </p>
          <h3 className="font-semibold text-lg">4. Security of Your Information</h3>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
