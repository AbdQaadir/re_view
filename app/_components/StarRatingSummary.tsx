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
  return (
    <div className="flex flex-col items-center gap-2 border rounded-lg p-4 shadow-md w-72 bg-white">
      <div className="w-full flex flex-col items-center">
        {/* Average Rating */}
        <p className="text-3xl font-bold">{averageRating.toFixed(1)}/5</p>
        <p className="text-xl text-yellow-500 flex">
          {`★\t`.repeat(Math.round(averageRating))}
        </p>
        <p className="text-gray-500 text-sm">{totalReviews} verified reviews</p>
      </div>

      {/* Rating Distribution */}
      <div className="mt-3 w-full">
        {ratingDistribution.map(({ stars, count }) => (
          <div key={stars} className="flex items-center gap-4">
            <p className="text-sm font-medium">
              {stars} <span className="text-yellow-500">{"★"}</span>
            </p>
            <span className="text-sm text-gray-500 font-light">({count})</span>
            <div className="bg-gray-300 flex-1 h-2 rounded-full overflow-hidden">
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
