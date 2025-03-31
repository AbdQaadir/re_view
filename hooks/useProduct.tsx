import { useState, useEffect, useCallback } from "react";
import { ProductType, ReviewType } from "@/types";
import useSupabase from "./useSupabase";
import { DB_TABLES } from "@/app/_constants";

export function useProduct(productId: string) {
  const supabase = useSupabase();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch product with reviews
      const { data, error } = await supabase
        .from(DB_TABLES.PRODUCT)
        .select("*, reviews:review(*, user_id_to_user:user_id(*))") // Get product + reviews + user details
        .eq("id", productId)
        .single();

      if (error) throw error;

      setProduct(data);
      setReviews(data.reviews || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const refresh = useCallback(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId, fetchProduct]);

  return { product, reviews, loading, error, refresh };
}
