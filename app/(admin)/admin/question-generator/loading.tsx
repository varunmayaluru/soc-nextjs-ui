import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function QuestionGeneratorLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-72" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* File Upload Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6">
                <div className="flex flex-col items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="text-center space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Skeleton className="flex-1 h-12" />
              <Skeleton className="h-12 w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Info Card Skeleton */}
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
