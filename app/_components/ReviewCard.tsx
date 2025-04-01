import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReviewType } from "@/types";
import { useUser } from "@clerk/nextjs";
import { EllipsisVertical, Pen, Trash } from "lucide-react";
import React from "react";

type ReviewCard = {
  review: ReviewType;
  isDeleting?: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};
function ReviewCard({ review, isDeleting, onDelete, onEdit }: ReviewCard) {
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
          <Popover>
            <PopoverTrigger>
              <EllipsisVertical
                size={20}
                className="cursor-pointer text-gray-500"
              />
            </PopoverTrigger>
            <PopoverContent
              side="left"
              sideOffset={10}
              className="w-auto flex flex-col gap-2 p-2 bg-white shadow-md rounded-md"
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-left justify-start text-red-500 hover:text-red-600"
                onClick={() => onDelete(review.id)}
              >
                <Trash size={16} />
                {isDeleting ? "Deleting..." : "Delete review"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-left justify-start"
                onClick={() => onEdit(review.id)}
              >
                <Pen size={16} />
                Edit
              </Button>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <p className="text-yellow-500">⭐ {review.rating}/5</p>
      <p className="text-gray-700 font-medium">{review.title}</p>

      <p className="text-gray-500 font-light">{review.review}</p>
    </div>
  );
}

export default ReviewCard;
