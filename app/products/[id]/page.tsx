"use client";

import { useProduct } from "@/hooks/useProduct";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const { id } = useParams();
  const { product, reviews, loading, error } = useProduct(id as string);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <Image
        src={product.image_url}
        alt={product.name}
        width={400}
        height={400}
        className="w-full max-h-80 object-cover rounded-lg"
      />
      <p className="mt-4 text-lg">{product.description}</p>
      <p className="mt-2 text-gray-600">Category: {product.category}</p>

      <h2 className="mt-6 text-xl font-semibold">Reviews ({reviews.length})</h2>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="border-t pt-4 mt-4">
            <p className="font-semibold">{review.user_id.name}</p>
            <p className="text-yellow-500">⭐ {review.rating}/5</p>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No reviews yet.</p>
      )}
    </div>
  );
}
