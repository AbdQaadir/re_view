import { Badge } from "@/components/ui/badge";
import { ReviewType } from "@/types";
import { NotepadText } from "lucide-react";
import Image from "next/image";
import React from "react";

type ReviewRecordCard = {
  review: ReviewType;
  onClick: (productId: string) => void;
};
function ReviewRecordCard({ review, onClick }: ReviewRecordCard) {
  return (
    <div
      key={review.id}
      className="border p-4 rounded-lg shadow-md flex items-start space-x-4 cursor-pointer"
      onClick={() => onClick(review.product_id)}
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
          <h2 className="text-lg font-semibold">{review?.product?.name}</h2>
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

          <p className="text-yellow-500 font-medium">⭐ {review.rating}/5</p>
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
}

export default ReviewRecordCard;
