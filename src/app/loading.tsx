
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <Skeleton className="w-16 h-16 rounded-2xl mx-auto mb-4" />
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-6 w-24 mx-auto mt-3" />
        </div>

        <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
              <div className="space-y-2 mt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-40 w-full" />
              <div className="flex justify-center">
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
        </Card>

        <div className="mt-12 flex justify-center items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </div>
  );
}
