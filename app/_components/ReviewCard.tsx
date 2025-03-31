import { Button } from "@/components/ui/button";
import { ReviewType } from "@/types";
import { useUser } from "@clerk/nextjs";
import { Trash } from "lucide-react";
import React from "react";

type ReviewCard = {
  review: ReviewType;
  onDelete: (id: string) => void;
};
function ReviewCard({ review, onDelete }: ReviewCard) {
  const { user } = useUser();

  const isMyReview = review.user_id === user?.id;
  return (
    <div key={review.id} className="border p-3 rounded-lg shadow-sm">
      <div className="flex items-baseline justify-between">
        <p className="font-semibold">
          {review.user_id_to_user?.first_name}

          {isMyReview && <span> (You)</span>}

          <span className="text-gray-500 text-sm font-light ml-2">
            {new Date(review.created_at).toLocaleDateString()}
          </span>
        </p>

        {isMyReview && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(review.id)}
          >
            <Trash size={16} />
          </Button>
        )}
      </div>
      <p className="text-yellow-500">⭐ {review.rating}/5</p>
      <p className="text-gray-700 font-medium">{review.title}</p>

      <p className="text-gray-500 font-light">{review.review}</p>
    </div>
  );
}

export default ReviewCard;
