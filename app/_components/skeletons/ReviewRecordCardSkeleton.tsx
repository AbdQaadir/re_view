import { Skeleton } from "@/components/ui/skeleton";
import { NotepadText } from "lucide-react";
import React from "react";

const ReviewRecordCardSkeleton = () => {
  return (
    <div className="border p-4 rounded-lg shadow-md flex items-start space-x-4 cursor-pointer">
      {/* Image Skeleton */}
      <Skeleton className="w-36 h-36 rounded-lg" />

      <div className="flex flex-col gap-3 w-full">
        {/* Product Name & Date Skeleton */}
        <div className="flex flex-col gap-0">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24 mt-1" />
        </div>

        {/* Badge & Rating Skeleton */}
        <div className="flex gap-2 items-center">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Review Title & Content Skeleton */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            <NotepadText className="w-4 h-4 text-gray-400" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-4 w-full mt-1" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default ReviewRecordCardSkeleton;
