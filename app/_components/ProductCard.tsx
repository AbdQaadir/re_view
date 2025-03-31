"use client";

import Link from "next/link";
import { Star, StarHalf } from "lucide-react";
import Image from "next/image";
import { ProductCategory } from "../_constants";
import { Badge } from "@/components/ui/badge";

type ProductCardProps = {
  id: string;
  name: string;
  description?: string;
  category?: ProductCategory;
  rating?: number;
  review_count?: number;
  image_url: string;
  className?: string;
};
export default function ProductCard({
  id,
  name,
  description,
  category,
  image_url,
  rating = 0,
  review_count = 0,
  className = "",
}: ProductCardProps) {
  return (
    <div
      className={`bg-white flex shadow-lg rounded-xl overflow-hidden ${className}`}
    >
      <Link href={`/products/${id}`} className="w-full flex flex-col">
        <div>
          <Image
            src={image_url}
            alt={name}
            width={400}
            height={200}
            className="w-full max-w-[280px] mx-auto h-36 sm:h-48 object-contain"
          />
        </div>

        <div className="h-full flex flex-col flex-1 justify-between py-8 px-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
              {name}
            </h3>

            {description && (
              <p className="text-sm text-gray-600 line-clamp-3">
                {description}
              </p>
            )}

            {category && <Badge variant="default">{category}</Badge>}
          </div>
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
        </div>
      </Link>
    </div>
  );
}
