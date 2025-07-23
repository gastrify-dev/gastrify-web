"use client";

import { Card, CardContent } from "@/shared/components/ui/card";

export default function NotificationSkeleton() {
  return (
    <div className="h-full w-full border-r md:w-1/2">
      <ul className="divide-y">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i}>
            <Card className="bg-muted w-full animate-pulse border transition-colors">
              <CardContent className="p-0">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="h-4 w-1/2 rounded bg-gray-300" />
                  <div className="h-3 w-12 rounded bg-gray-200" />
                </div>
                <div className="text-muted-foreground hidden px-4 pb-3 md:block">
                  <div className="h-3 w-3/4 rounded bg-gray-200" />
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
