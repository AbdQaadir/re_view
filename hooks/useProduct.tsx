import { useState, useEffect, useCallback } from "react";
import { ProductType } from "@/types";
import useSupabase from "./useSupabase";

export function useProduct(productId: string) {
  const supabase = useSupabase();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch product with reviews
      const { data, error } = await supabase
        .from("product")
        .select("*, review(*, user_id(*))") // Get product + reviews + user details
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

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId, fetchProduct]);

  return { product, reviews, loading, error };
}
