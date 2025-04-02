import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReviewType } from "@/types";
import { useUser } from "@clerk/nextjs";
import { EllipsisVertical, Pen, Trash } from "lucide-react";
import Image from "next/image";
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
    <div key={review.id} className="shadow-none">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-yellow-500">{`★\t`.repeat(review.rating)}</span>
          <span className="text-gray-400">
            {`★\t`.repeat(5 - review.rating)}
          </span>
        </div>
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
                Edit review
              </Button>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <p className="text-gray-900 font-light">{review.review}</p>

      {/* Display image if available */}
      {review.image_url && (
        <div className="">
          <Image
            src={review.image_url}
            alt="Review Image"
            className="rounded-md"
            width={150}
            height={150}
          />
        </div>
      )}
      <div className="mt-2 flex gap-2 items-center">
        <span className="text-gray-500 text-sm font-light">
          {new Date(review.created_at).toLocaleDateString()}
        </span>

        <p className="text-gray-600 text-sm font-light">
          - by{" "}
          {review.user_id_to_user?.username
            ? `@${review.user_id_to_user?.username}`
            : review.user_id_to_user?.first_name}
          {isMyReview && <span> (Me)</span>}
        </p>
      </div>
    </div>
  );
}

export default ReviewCard;
