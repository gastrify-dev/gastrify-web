import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/shared/components/ui/card";

export const NotificationSkeleton = () => {
  return (
    <Card className="flex-1 border-none bg-transparent p-0">
      <CardHeader>
        <Skeleton className="h-7 w-3/4" />

        <Skeleton className="h-4 w-32" />

        <CardAction>
          <Skeleton className="h-10 w-10 rounded-full" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
    </Card>
  );
};
