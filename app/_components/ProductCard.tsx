"use client";

import Link from "next/link";
import { Star, StarHalf } from "lucide-react";
import Image from "next/image";
import { ProductCategory } from "../_constants";

type ProductCardProps = {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  rating?: number;
  review_count?: number;
  image_url: string;
  className?: string;
  onClick: () => void;
};
export default function ProductCard({
  id,
  name,
  category,
  image_url,
  rating = 0,
  review_count = 0,
  description,
  className = "",
}: ProductCardProps) {
  return (
    <div
      className={`bg-white shadow-lg rounded-xl overflow-hidden p-4 ${className}`}
    >
      <Link href={`/product/${id}`} className="flex flex-col">
        <div>
          <Image
            src={image_url}
            alt={name}
            width={400}
            height={200}
            className="w-full max-w-[280px] mx-auto h-36  sm:h-48 md:h-64 object-center rounded-md"
          />
        </div>

        <div className="mt-4 flex flex-col flex-1 justify-between">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-3">
            {name}
          </h3>
          <p className="text-sm text-gray-500">{category}</p>
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => {
              const isHalf = rating % 1 > 0 && i === Math.floor(rating);

              if (isHalf) {
                return (
                  <StarHalf key={i} size={16} color="#f0b100" fill="#f0b100" />
                );
              }
              return (
                <Star
                  key={i}
                  size={16}
                  color="#f0b100"
                  fill={i < Math.round(rating) ? "#f0b100" : "#fff"}
                />
              );
            })}
            <span className="ml-2 text-sm text-gray-600">
              ({review_count} reviews)
            </span>
          </div>
          {description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
