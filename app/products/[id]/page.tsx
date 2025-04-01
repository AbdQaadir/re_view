"use client";

import ReviewModal from "@/app/_components/ReviewModal";
import ReviewCard from "@/app/_components/ReviewCard";
import { DB_TABLES } from "@/app/_constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/useProduct";
import useSupabase from "@/hooks/useSupabase";
import { ReviewType } from "@/types";
import { useClerk, useUser } from "@clerk/nextjs";
import { ArrowLeft, PlusIcon, Search } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import ProductPageSkeleton from "@/app/_components/ProductPageSkeleton";
import StarRatingSummary from "@/app/_components/StarRatingSummary";

export default function ProductPage() {
  // Hooks
  const router = useRouter();
  const { id } = useParams();
  const supabase = useSupabase();
  const { isSignedIn } = useUser();
  const clerk = useClerk();

  const { product, reviews, loading, refresh } = useProduct(id as string);

  // States
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewType | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Calculate average rating
  const averageRating = useMemo(() => {
    return reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (!selectedRating) return reviews;

    return reviews.filter((r) => {
      // Check within the range of selected rating
      return r.rating >= selectedRating && r.rating < selectedRating + 1;
    });
  }, [reviews, selectedRating]);

  const handleRefresh = () => {
    refresh();
  };
  const handleGoBack = () => {
    router.back();
  };

  const handleDeleteReview = async (id: string) => {
    // Delete review
    try {
      setIsDeleting(true);
      await supabase.from(DB_TABLES.REVIEW).delete().eq("id", id);
      handleRefresh();
    } catch (error) {
      toast.error("Failed to delete review");
      console.log("Error deleting review", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditReview = (id: string) => {
    const review = reviews.find((r) => r.id === id);
    if (!review) return;

    // Open modal with review data
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const onClickAddReview = () => {
    // Check if user is logged in

    if (!isSignedIn) {
      toast.info("Redirecting to sign in...");

      return clerk.redirectToSignIn({
        redirectUrl: `${window.location.href}?modalOpen=true`,
      });
    }

    setIsModalOpen(true);
  };

  const reviewsByRating = useMemo(() => {
    return reviews.reduce((acc, review) => {
      if (!acc[review.rating]) {
        acc[review.rating] = [];
      }

      acc[review.rating].push(review);

      return acc;
    }, {} as Record<number, ReviewType[]>);
  }, [reviews]);

  return (
    <>
      {/* Review Modal */}
      {isModalOpen && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedReview(null);
          }}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedReview(null);
            handleRefresh();
          }}
          selectedReview={selectedReview}
          productId={id as string}
        />
      )}

      {/*  Product Page Skeleton */}
      {loading && !product && <ProductPageSkeleton />}

      {/*  Product Page */}
      {!loading && product && (
        <div className="max-w-6xl mx-auto py-3 md:py-6 px-3 md:px-6 pb-24">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleGoBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-md md:text-xl font-semibold">
              Product Details:{" "}
            </h1>
          </div>
          {/* Top Section: Image + Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Product Image */}
            <div className="flex justify-center w-full mx-auto border min-h-[200px] md:min-h-[300px]">
              <Image
                src={product.image_url}
                alt={product.name}
                width={400}
                height={400}
                className="w-full max-w-[300px] max-h-[400px]"
              />
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h1 className="text-xl md:text-2xl font-bold">{product.name}</h1>
              <p className="text-gray-600">
                Category: <Badge>{product.category}</Badge>
              </p>

              <div className="flex items-center space-x-2">
                <p className="text-yellow-500 text-lg">
                  ⭐ {averageRating.toFixed(1)}
                </p>
                <p className="text-gray-500">({reviews.length} reviews)</p>
              </div>
              <p className="text-xs md:text-md leading-[18px] text-gray-700">
                {product.description}
              </p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-10 w-full">
            <div className="w-full flex gap-4">
              <div className="w-full flex-1 flex flex-col gap-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <h2 className="text-lg md:text-2xl font-semibold">
                    Customer Reviews
                  </h2>

                  <Button size="sm" onClick={onClickAddReview}>
                    <PlusIcon className="w-4 h-4" />
                    Add
                  </Button>
                </div>

                <div className="py-3 w-full">
                  {/* Filter by Rating */}
                  <div className="w-full flex items-center gap-1 overflow-x-auto py-2">
                    <Button
                      variant={selectedRating ? "outline" : "default"}
                      onClick={() => setSelectedRating(null)}
                      size="sm"
                    >
                      All
                      <span className="hidden md:inline">reviews</span>
                      <span>({reviews.length})</span>
                    </Button>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const isActive = selectedRating === star;
                      return (
                        <Button
                          key={star}
                          variant={isActive ? "default" : "outline"}
                          onClick={() => setSelectedRating(star)}
                          size="sm"
                          className="gap-0.5"
                        >
                          {star}
                          <p className="text-yellow-500">{"★"}</p>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Reviews */}
                  {filteredReviews.length > 0 && (
                    <div className="flex flex-col gap-3 mt-4">
                      {filteredReviews.map((review, index) => {
                        const isLast = index === filteredReviews.length - 1;
                        return (
                          <React.Fragment key={`${review.id}-${index}`}>
                            <ReviewCard
                              review={review}
                              isDeleting={isDeleting}
                              onDelete={handleDeleteReview}
                              onEdit={handleEditReview}
                            />
                            {!isLast && <hr className="border-b" />}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  )}

                  {!filteredReviews.length && (
                    <div className="w-full flex flex-col gap-2 items-center justify-center min-h-32 py-10">
                      <Search className="w-7 h-7" />

                      <p className="text-gray-500">
                        No reviews found
                        {selectedRating && ` for ${selectedRating} stars`}
                      </p>
                      {!selectedRating && (
                        <span>
                          Click the &ldquo;Add&rdquo; button to add one!
                        </span>
                      )}

                      {selectedRating && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => setSelectedRating(null)}
                        >
                          Clear filter
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden md:block sticky top-3 right-0 h-[fit-content]">
                <StarRatingSummary
                  averageRating={averageRating || 0}
                  totalReviews={reviews?.length || 0}
                  ratingDistribution={[
                    { stars: 5, count: reviewsByRating[5]?.length || 0 },
                    { stars: 4, count: reviewsByRating[4]?.length || 0 },
                    { stars: 3, count: reviewsByRating[3]?.length || 0 },
                    { stars: 2, count: reviewsByRating[2]?.length || 0 },
                    { stars: 1, count: reviewsByRating[1]?.length || 0 },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
