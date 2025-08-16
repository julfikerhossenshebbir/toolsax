import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'DMCA Policy | Toolsax',
    description: 'DMCA Policy for Toolsax.',
};

export default function DMCAPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>DMCA Policy</CardTitle>
          <CardDescription>Digital Millennium Copyright Act</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Toolsax respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond promptly to notices of alleged copyright infringement that are duly reported to our Designated Copyright Agent.
          </p>
          <h3 className="font-semibold text-lg">Reporting Copyright Infringement</h3>
          <p>
            If you are a copyright owner, or are authorized to act on behalf of one, please report alleged copyright infringements taking place on or through our site by completing the following DMCA Notice of Alleged Infringement and delivering it to our Designated Copyright Agent.
          </p>
          <p>
            Your notice must include:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Identification of the material that is claimed to be infringing and that is to be removed.</li>
            <li>Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and, if available, an email address.</li>
            <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
            <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
