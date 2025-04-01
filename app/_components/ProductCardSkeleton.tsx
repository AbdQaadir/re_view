import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function ProductCardSkeleton({ className = "" }) {
  return (
    <div
      className={`bg-white flex shadow-lg rounded-xl overflow-hidden ${className}`}
    >
      <div className="w-full flex flex-col">
        <AspectRatio ratio={1} className="flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </AspectRatio>

        <div className="h-full flex flex-col flex-1 justify-between py-4 px-4">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-5/6 mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-4 rounded-full mx-0.5" />
            ))}
            <Skeleton className="ml-2 h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
