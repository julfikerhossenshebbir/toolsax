import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cookie Policy | Toolsax',
    description: 'Cookie Policy for Toolsax.',
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Cookie Policy</CardTitle>
          <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="font-semibold text-lg">What Are Cookies?</h3>
          <p>
            Cookies are small text files stored on your device (computer, tablet, mobile phone) when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site.
          </p>
          <h3 className="font-semibold text-lg">How We Use Cookies</h3>
          <p>
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences.</li>
            <li><strong>Analytics Cookies:</strong> We use third-party analytics services (like Firebase Analytics) to understand how our visitors use the website. This helps us improve the site by monitoring which pages are most and least popular.</li>
             <li><strong>Advertisement Cookies:</strong> We use cookies to track ad views and manage the ad experience, such as limiting the number of times you see an ad and ensuring a cooldown period between ads.</li>
          </ul>
           <h3 className="font-semibold text-lg">Managing Cookies</h3>
          <p>
            You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
