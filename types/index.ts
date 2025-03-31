import { ProductCategory } from "@/app/_constants";

export type UserType = {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  user_id: string;
  created_at: string;
};
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
  user_id_to_user?: UserType;
  rating: number;
  title: string;
  review?: string;
  created_at: string;

  // Related data
  product?: ProductType;
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
