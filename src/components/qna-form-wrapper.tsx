import { Suspense } from 'react';
import { QnaForm } from './qna-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

function QnaFormFallback() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle /> Q&A Form
        </CardTitle>
        <CardDescription>
          Loading form...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function QnaFormWrapper() {
  return (
    <Suspense fallback={<QnaFormFallback />}>
      <QnaForm />
    </Suspense>
  );
}
