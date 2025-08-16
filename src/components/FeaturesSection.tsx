
import { Card, CardContent } from '@/components/ui/card';
import { BadgeCheck, ShieldCheck, Code, Rocket, Feather, CloudOff } from 'lucide-react';

const features = [
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: 'Blazing Fast Performance',
    description: 'Built with Next.js for a speedy, responsive user experience.',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Secure & Private',
    description: 'All tools run client-side, so your data never leaves your browser.',
  },
  {
    icon: <Code className="h-8 w-8 text-primary" />,
    title: 'Open Source & Free',
    description: 'Completely free to use, with the source code available on GitHub.',
  },
  {
    icon: <Feather className="h-8 w-8 text-primary" />,
    title: 'Modern, Clean UI',
    description: 'A beautiful and intuitive interface built with ShadCN UI and Tailwind CSS.',
  },
  {
    icon: <BadgeCheck className="h-8 w-8 text-primary" />,
    title: 'Constantly Expanding',
    description: 'New tools and features are added regularly to expand the collection.',
  },
  {
    icon: <CloudOff className="h-8 w-8 text-primary" />,
    title: 'Works Offline',
    description: 'Many tools are available offline, so you can use them anytime, anywhere.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Why Choose Toolsax?</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to streamline your workflow
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A comprehensive suite of tools designed for performance, security, and ease of use—all in one place.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:border-primary/80 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                    <div className="flex items-center gap-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            {feature.icon}
                        </div>
                        <h3 className="text-lg font-semibold leading-7 text-foreground">{feature.title}</h3>
                    </div>
                  <p className="mt-5 text-base leading-7 text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
