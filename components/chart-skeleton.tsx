import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle><Skeleton className="h-6 w-[200px]" /></CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  )
}

