import { useState, useCallback } from "react";
import { ProductType, ReviewType } from "@/types";
import useSupabase from "./useSupabase";
import { ProductCategory } from "@/app/_constants";

type FetchProductsType = {
  limit?: number;
  category?: ProductCategory;
  filter?: "all" | "latest" | "top";
};
export function useProducts() {
  const supabase = useSupabase();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products (filtered by category, limit)
  const fetchProducts = useCallback(
    async ({ limit, category, filter }: FetchProductsType) => {
      setLoading(true);
      try {
        let query = supabase.from("product").select(
          `*, reviews:
            review(
              *
            )`
        );

        if (category) query = query.eq("category", category);
        if (limit && filter === "all") query = query.limit(limit);

        const { data, error } = await query;

        if (error) throw error;

        const formattedData = data.map((product) => ({
          ...product,
          rating: !!product.reviews?.length
            ? product.reviews.reduce(
                (sum: number, r: ReviewType) => sum + r.rating,
                0
              ) / product.reviews.length
            : 0,
          review_count: product.reviews?.length || 0,
        }));

        if (filter === "top") {
          // Sort by highest rating
          formattedData.sort((a, b) => b.rating - a.rating);
        }
        if (filter === "latest") {
          // Sort by latest
          formattedData.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
        }

        if (limit && filter !== "all") {
          // Limit the number of products
          formattedData.splice(limit);
        }

        return formattedData as ProductType[];
      } catch (err: any) {
        setError(err.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    fetchProducts,
  };
}
