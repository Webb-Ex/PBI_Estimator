import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function PBITableSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-72" /> {/* Search bar */}
          <div className="flex gap-4">
            <Skeleton className="h-10 w-40" /> {/* T-Size Scale */}
            <Skeleton className="h-10 w-40" /> {/* Product Filter */}
          </div>
        </div>

        {/* Table Section */}
        <div className="border rounded-lg">
          {/* Table Header */}
          <div className="flex gap-4 p-4 bg-muted/10">
            <Skeleton className="h-4 w-4" /> {/* Checkbox */}
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Table Rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border-t">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-10 w-32" /> {/* Items per page */}
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" /> {/* Previous */}
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-20" /> {/* Next */}
          </div>
        </div>

        {/* Footer Metrics */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-8 w-40" />
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}