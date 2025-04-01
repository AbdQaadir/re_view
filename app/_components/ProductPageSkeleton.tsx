import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, PlusIcon } from "lucide-react";
import React from "react";

function ProductPageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto py-3 md:py-6 px-3 md:px-6 pb-24">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" disabled>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-md md:text-xl font-semibold">Product Details:</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <Skeleton className="w-full h-[300px] md:h-[400px]" />

        <div className="space-y-4">
          <Skeleton className="h-6 w-2/3" />

          <Skeleton className="h-4 w-1/3" />

          <Skeleton className="h-4 w-1/4" />

          <Skeleton className="h-12 w-full" />
        </div>
      </div>

      <div className="mt-10">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg md:text-2xl font-semibold">
            Customer Reviews
          </h2>
          <Button size="sm" disabled>
            <PlusIcon className="w-4 h-4" /> Add
          </Button>
        </div>

        <div className="py-3">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            <Button variant="outline" size="sm">
              All reviews <span className="ml-1">(0)</span>
            </Button>
            {[5, 4, 3, 2, 1].map((star) => (
              <Button key={star} variant="outline" size="sm">
                {star} ⭐
              </Button>
            ))}
          </div>

          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}

export default ProductPageSkeleton;
