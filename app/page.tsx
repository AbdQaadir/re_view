"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "./_components/ProductCard";
import { ProductCategory } from "./_constants";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/types";
import { useProducts } from "@/hooks/useProducts";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

const categories = [
  {
    id: ProductCategory.Electronics,
    name: ProductCategory.Electronics,
    description: "Find the best electronics products",
    image: "/images/electronics.jpg",
  },
  {
    id: ProductCategory.Men_Clothing,
    name: "Men's Clothing",
    description: "Find the best men's clothing products",
    image: "/images/clothing.jpeg",
  },
  {
    id: ProductCategory.Women_Clothing,
    name: "Women's clothing",
    description: "Find the best women's clothing products",
    image: "/images/home.jpg",
  },
  {
    id: ProductCategory.Jewelery,
    name: "Jewelery",
    description: "Find the best jewelery products",
    image: "/images/beauty.webp",
  },
];

export default function Home() {
  const router = useRouter();

  const { loading, fetchProducts } = useProducts();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [latestRatedProducts, setLatestRatedProducts] = useState<ProductType[]>(
    []
  );
  const [topRatedProducts, setTopRatedProducts] = useState<ProductType[]>([]);
  const [search, setSearch] = useState("");

  const handleChange = (value: string) => {
    setSearch(value);
  };

  const handleProductClick = (id: string) => {
    router.push(`/products/${id}`);
  };

  const initializeApp = async () => {
    Promise.allSettled([
      fetchProducts({ limit: undefined, category: undefined, filter: "all" }),
      fetchProducts({ limit: 6, category: undefined, filter: "latest" }),
      fetchProducts({ limit: 4, category: undefined, filter: "top" }),
    ]).then((results) => {
      const [allProducts, latestRatedProducts, topRatedProducts] = results;
      if (allProducts.status === "fulfilled") {
        setProducts(allProducts.value);
      }

      if (latestRatedProducts.status === "fulfilled") {
        setLatestRatedProducts(latestRatedProducts.value);
      }

      if (topRatedProducts.status === "fulfilled") {
        setTopRatedProducts(topRatedProducts.value);
      }
    });
  };

  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <div className="p-2 pb-2 flex flex-col gap-8">
      {/* Hero section */}
      <section className="w-full max-w-[700px] mx-auto p-4 min-h-[calc(60vh-4rem)] flex flex-col justify-center items-center gap-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl md:text-6xl font-bold">Welcome to re_view</h1>
          <p className="text-md md:text-2xl font-light">
            Find the Best Products, Rated by Real Users
          </p>
        </div>

        <div className="w-full">
          <Input
            value={search}
            className="h-11 w-full"
            placeholder="Search for products"
            onChange={(e) => handleChange(e.target.value)}
          />
          <Button onClick={initializeApp}>Initialize Products</Button>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto p-4 flex flex-col gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-1">Categories</h2>
          <p className="text-sm md:text-md font-light">
            Find the best products in the categories you love. Get the best
            products based on real user reviews.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            return (
              <Link key={category.id} href={`/category/${category.id}`}>
                <div className="flex flex-col items-center gap-2 bg-white rounded-md shadow-md h-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    className="w-full h-40 object-cover rounded-md"
                    width={300}
                    height={200}
                  />
                  <div className="pt-2 px-2 pb-4">
                    <h3 className="text-md md:text-xl font-bold capitalize">
                      {category.name}
                    </h3>
                    <p className="text-sm md:text-md font-light">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Top Rated Products */}
      <section className="container mx-auto p-4 flex flex-col gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-1">
            Top Rated Products
          </h2>
          <p className="text-sm md:text-md font-light">
            Find the top rated products on re_view. Get the best products based
            on real user
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center w-full h-32">
            <Loader size={32} className="animate-spin text-gray-800" />
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {topRatedProducts?.map((product, index) => {
              return (
                <ProductCard
                  key={`product-$${product.id}-${index}`}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  category={product.category}
                  image_url={product.image_url}
                  rating={product.rating}
                  review_count={product.review_count}
                  onClick={() => handleProductClick(product.id)}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Latest Reviews */}
      <section className="container mx-auto p-4 flex flex-col gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-1">Latest Reviews</h2>
          <p className="text-sm md:text-md font-light">
            Find the latest reviews on the best products. Get the most
            up-to-date information on the products you love.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center w-full h-32">
            <Loader size={32} className="animate-spin text-gray-800" />
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestRatedProducts?.map((product, index) => {
              return (
                <ProductCard
                  key={`product-$${product.id}-${index}`}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  category={product.category}
                  image_url={product.image_url}
                  rating={product.rating}
                  review_count={product.review_count}
                  onClick={() => handleProductClick(product.id)}
                />
              );
            })}
          </div>
        )}
      </section>

      <section className="container mx-auto p-4 flex flex-col gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-1">All Products</h2>
          <p className="text-sm md:text-md font-light">
            Find the top rated products on re_view. Get the best products based
            on real user
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center w-full h-32">
            <Loader size={32} className="animate-spin text-gray-800" />
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {products?.map((product, index) => {
              return (
                <ProductCard
                  key={`product-$${product.id}-${index}`}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  category={product.category}
                  image_url={product.image_url}
                  rating={product.rating}
                  review_count={product.review_count}
                  onClick={() => handleProductClick(product.id)}
                />
              );
            })}
          </div>
        )}
      </section>
      {/* Footer */}
      <footer className="p-4 bg-gray-800 text-white text-center py-8 mt-8">
        <p>&copy; {new Date().getFullYear()} re_view. All rights reserved.</p>

        <p>
          Made with{" "}
          <span role="img" aria-label="heart">
            ❤️
          </span>{" "}
          by{" "}
          <a
            href="https://github.com/abdqaadir"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            MuftyCodes
          </a>
        </p>
      </footer>
    </div>
  );
}
