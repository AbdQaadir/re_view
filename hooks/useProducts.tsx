import { useState, useCallback, useEffect } from "react";
import { ProductType, ReviewType } from "@/types";
import useSupabase from "./useSupabase";
import { DB_TABLES, ProductCategory } from "@/app/_constants";

type FetchProductsType = {
  limit?: number;
  category?: ProductCategory;
  filter?: "all" | "latest" | "top";
};
export function useProducts() {
  const supabase = useSupabase();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products (filtered by category, limit)
  const fetchProducts = useCallback(
    async ({ limit, category, filter }: FetchProductsType) => {
      setLoading(true);
      try {
        let query = supabase.from(DB_TABLES.PRODUCT).select(
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

  const [productsByCategory, setProductsByCategory] = useState<{
    [key: string]: ProductType[];
  }>({
    [ProductCategory.Beauty]: [],
    [ProductCategory.Laptops]: [],
    [ProductCategory.Smartphones]: [],
    [ProductCategory.Tablets]: [],
    [ProductCategory.Vehicle]: [],
  });

  const [topRatedProducts, setTopRatedProducts] = useState<ProductType[]>([]);

  const fetchProductsByCategory = async () => {
    Promise.allSettled([
      fetchProducts({
        limit: undefined,
        category: ProductCategory.Beauty,
        filter: "all",
      }),
      fetchProducts({
        limit: undefined,
        category: ProductCategory.Laptops,
        filter: "all",
      }),
      fetchProducts({
        limit: undefined,
        category: ProductCategory.Smartphones,
        filter: "all",
      }),
      fetchProducts({
        limit: undefined,
        category: ProductCategory.Tablets,
        filter: "all",
      }),
      fetchProducts({
        limit: undefined,
        category: ProductCategory.Vehicle,
        filter: "all",
      }),
      fetchProducts({ limit: 4, category: undefined, filter: "top" }),
    ]).then((results) => {
      const [
        beautyProducts,
        laptopProducts,
        smartphoneProducts,
        tabletProducts,
        vehicleProducts,
        topRatedProducts,
      ] = results;

      const products: {
        [key: string]: ProductType[];
      } = {};

      if (beautyProducts.status === "fulfilled") {
        products[ProductCategory.Beauty] =
          beautyProducts.value as ProductType[];
      }

      if (laptopProducts.status === "fulfilled") {
        products[ProductCategory.Laptops] = laptopProducts.value;
      }

      if (smartphoneProducts.status === "fulfilled") {
        products[ProductCategory.Smartphones] = smartphoneProducts.value;
      }

      if (tabletProducts.status === "fulfilled") {
        products[ProductCategory.Tablets] = tabletProducts.value;
      }

      if (vehicleProducts.status === "fulfilled") {
        products[ProductCategory.Vehicle] = vehicleProducts.value;
      }

      setProductsByCategory(products);

      if (topRatedProducts.status === "fulfilled") {
        setTopRatedProducts(topRatedProducts.value);
      }
    });
  };

  useEffect(() => {
    fetchProductsByCategory();
  }, []);
  return {
    loading,
    error,
    productsByCategory,
    topRatedProducts,
  };
}
