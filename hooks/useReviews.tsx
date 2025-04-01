import { useEffect, useState } from "react";
import useSupabase from "./useSupabase";
import { ReviewType } from "@/types";

function useReviews(userId: string) {
  const supabase = useSupabase();

  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("review")
      .select("*, product:product(name, description, image_url, category)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error?.message);
    } else {
      setReviews(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!userId) return;

    fetchReviews();
  }, [userId]);

  return {
    reviews,
    loading,
    error,
    fetchReviews,
  };
}

export default useReviews;
