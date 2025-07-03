import { Skeleton } from "@/components/ui/skeleton";

export function QuestionPanelSkeleton() {
    return (
        <div className="p-6 flex flex-col gap-4">
            {/* Breadcrumb/Banner */}
            <Skeleton className="h-8 w-2/3 mb-2 rounded-lg bg-gray-200" />
            {/* Pagination */}
            <div className="flex gap-2 mb-2">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-6 rounded-full bg-gray-200" />
                ))}
            </div>
            {/* Question header */}
            <Skeleton className="h-6 w-3/4 mb-2 rounded bg-gray-200" />
            <Skeleton className="h-4 w-1/4 mb-4 rounded bg-gray-200" />
            {/* Options/Input */}
            <div className="flex flex-col gap-2 mb-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-full bg-gray-200" />
                ))}
            </div>
            {/* Action row */}
            <div className="flex gap-2 mt-4">
                <Skeleton className="h-10 w-24 rounded-md bg-gray-200" />
                <Skeleton className="h-10 w-32 rounded-md bg-gray-200" />
            </div>
        </div>
    );
} 