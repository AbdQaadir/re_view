import { ProductCategory } from "@/app/_constants";

export type ProductType = {
  id: string;
  created_at: string;
  name: string;
  category: ProductCategory;
  description: string;
  user_id: string;
  image_url: string;

  rating?: number;
  reviews?: ReviewType[];
  review_count?: number;

  ProductIdToRating?: ReviewType[];
  ProductIdToReviewCount?: number;
};

export type ReviewType = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
};
export type FakeProductType = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: "electronics" | "men's clothing" | "women's clothing" | "jewelery";
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};
