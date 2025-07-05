import { Skeleton } from "@/components/ui/skeleton";

export function ChatPanelSkeleton() {
    return (
        <div className="bg-white border-l border-gray-200 flex flex-col h-full p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1 bg-gray-200" />
                    <Skeleton className="h-3 w-24 bg-gray-200" />
                </div>
            </div>
            {/* Messages */}
            <div className="flex-1 flex flex-col gap-3 mb-4">
                <Skeleton className="h-6 w-2/3 rounded-lg self-start bg-gray-200" />
                <Skeleton className="h-6 w-1/2 rounded-lg self-end bg-gray-200" />
                <Skeleton className="h-6 w-3/4 rounded-lg self-start bg-gray-200" />
            </div>
            {/* Input row */}
            <div className="flex items-center gap-2 mt-auto">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-8 rounded-full bg-gray-200" />
                ))}
                <Skeleton className="h-8 flex-1 rounded-full bg-gray-200" />
                <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
            </div>
        </div>
    );
} 