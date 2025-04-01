"use client";

import Link from "next/link";
import { Star, StarHalf } from "lucide-react";
import Image from "next/image";
import { ProductCategory } from "../_constants";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useMemo } from "react";

type ProductCardProps = {
  id: string;
  name: string;
  description?: string;
  category?: ProductCategory;
  showCategory?: boolean;
  rating?: number;
  review_count?: number;
  image_url?: string;
  thumbnail?: string;
  className?: string;
};
export default function ProductCard({
  id,
  name,
  description,
  category,
  showCategory = true,
  image_url,
  thumbnail,
  rating = 0,
  review_count = 0,
  className = "",
}: ProductCardProps) {
  const scaleValue = useMemo(() => {
    console.log({ category });
    if (category === ProductCategory.Vehicle) {
      return 150;
    }

    if (category === ProductCategory.Smartphones) {
      return 100;
    }

    return 105;
  }, [category]);
  return (
    <div
      className={`bg-white flex shadow-lg rounded-xl overflow-hidden ${className}`}
    >
      <Link href={`/products/${id}`} className="w-full flex flex-col">
        <AspectRatio ratio={1} className="flex items-center justify-center ">
          <Image
            src={image_url || thumbnail || ""}
            alt={name}
            width={400}
            height={200}
            className={`w-full h-full mx-auto object-contain scale-${scaleValue}`}
          />
        </AspectRatio>

        <div className="h-full flex flex-col flex-1 justify-between py-4 px-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
              {name}
            </h3>

            {description && (
              <p className="text-sm text-gray-600 line-clamp-3">
                {description}
              </p>
            )}

            {category && showCategory && (
              <Badge variant="default">{category}</Badge>
            )}
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
