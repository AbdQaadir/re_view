"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import useSupabase from "@/hooks/useSupabase";
import { useRouter } from "next/navigation";
import { ReviewType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader, NotepadText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyReviews() {
  const router = useRouter();

  const supabase = useSupabase();

  const { userId } = useAuth(); // Clerk authentication
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("review")
      .select("*, product:product(name, description, image_url, category)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error?.message);
    } else {
      setReviews(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!userId) return;

    fetchReviews();
  }, [userId]);

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

      {loading && !reviews.length && (
        <div className="flex flex-col items-center justify-center space-x-2">
          <Loader size={24} className="animate-spin" />
          <p>Loading reviews...</p>
        </div>
      )}

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
        {reviews.map((review) => {
          return (
            <div
              key={review.id}
              className="border p-4 rounded-lg shadow-md flex items-start space-x-4 cursor-pointer"
              onClick={() => handleClick(review.product_id)}
            >
              <Image
                src={review?.product?.image_url || ""}
                alt={review?.product?.name || ""}
                width={800}
                height={800}
                className="w-36 h-36 object-cover rounded-lg"
              />
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-0">
                  <h2 className="text-lg font-semibold">
                    {review?.product?.name}
                  </h2>
                  <p className="text-gray-500 text-sm font-light">
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <Badge>{review?.product?.category}</Badge>

                  <p className="text-yellow-500 font-medium">
                    ⭐ {review.rating}/5
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-gray-900 font-bold flex items-center gap-1">
                    <NotepadText className="w-4 h-4" />
                    <span className="font-medium">{review.title}</span>
                  </h3>
                  {review.review && (
                    <p className="text-gray-700 font-light">{review.review}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
