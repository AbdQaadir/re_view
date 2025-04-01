"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReviewRecordCard from "../_components/ReviewRecordCard";
import ReviewRecordCardSkeleton from "../_components/skeletons/ReviewRecordCardSkeleton";
import useReviews from "@/hooks/useReviews";

export default function MyReviews() {
  const router = useRouter();

  const { userId } = useAuth(); // Clerk authentication

  const { reviews, loading, error, fetchReviews } = useReviews(userId!);

  const handleClick = (id: string) => {
    router.push(`/products/${id}`);
  };

  const handleGoBack = () => {
    router.back();
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex gap-1 items-center">
        <Button variant="ghost" onClick={handleGoBack} size="icon">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        My Reviews
      </h1>

      {!loading && !reviews.length && (
        <div className="flex flex-col items-center justify-center gap-3">
          <p>You haven’t written any reviews yet.</p>

          <Button size="lg" onClick={() => router.push("/")}>
            <Search className="w-4 h-4" />
            Find Products
          </Button>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center gap-3">
          <p>Error: {error}</p>
          <Button size="lg" onClick={fetchReviews}>
            Refresh
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {loading &&
          !reviews.length &&
          Array.from({ length: 3 }).map((_, i) => (
            <ReviewRecordCardSkeleton key={`skeleton-${i}-review`} />
          ))}

        {!loading &&
          reviews.map((review) => {
            return (
              <ReviewRecordCard
                key={`review-${review.id}-${review.product_id}`}
                review={review}
                onClick={handleClick}
              />
            );
          })}
      </div>
    </div>
  );
}
