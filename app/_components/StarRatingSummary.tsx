import React from "react";

type RatingSummaryProps = {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { stars: number; count: number }[];
};

const StarRatingSummary: React.FC<RatingSummaryProps> = ({
  averageRating,
  totalReviews,
  ratingDistribution,
}) => {
  console.log({ ratingDistribution });
  return (
    <div className="flex gap-6 border rounded-lg p-4 shadow-md w-72 bg-white">
      <div>
        {/* Average Rating */}
        <p className="text-4xl font-bold">{averageRating.toFixed(1)}</p>
        <p className="text-yellow-500 flex">
          {"★".repeat(Math.round(averageRating))}
        </p>
        <p className="text-gray-500 text-sm">{totalReviews} reviews</p>
      </div>

      {/* Rating Distribution */}
      <div className="mt-3 w-full">
        {ratingDistribution.map(({ stars, count }) => (
          <div key={stars} className="flex items-center gap-2">
            <span className="text-sm font-medium">{stars}</span>
            <div className="bg-gray-300 w-full h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full"
                style={{
                  width: `${!totalReviews ? 0 : (count / totalReviews) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StarRatingSummary;
