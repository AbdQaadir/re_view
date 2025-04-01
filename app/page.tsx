"use client";

import ProductCard from "./_components/ProductCard";
import { ProductType } from "@/types";
import { useProducts } from "@/hooks/useProducts";
import SearchBar from "./_components/SearchBar";
import { useRouter } from "next/navigation";
import ProductCardSkeleton from "./_components/skeletons/ProductCardSkeleton";

export default function Home() {
  const router = useRouter();
  const { loading, productsByCategory, topRatedProducts } = useProducts();

  const handleSearchClick = (product: ProductType) => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div className="p-2 pb-2 flex flex-col gap-6">
      {/* Hero section */}
      <section className="w-full max-w-[700px] mx-auto py-8 px-4 md:min-h-[calc(50vh-4rem)] flex flex-col justify-center items-center gap-4 text-center">
        <div className="flex flex-col items-center gap-2 md:gap-4">
          <h1 className="text-3xl md:text-6xl font-bold">Welcome to re_view</h1>
          <p className="text-sm md:text-xl font-light">
            Find the Best Products, Rated by Real Users
          </p>
        </div>

        <div className="w-full">
          <SearchBar
            onClick={(product: ProductType) => handleSearchClick(product)}
            products={
              Object.keys(productsByCategory)
                .map((category) => productsByCategory[category])
                ?.flat() || []
            }
          />
        </div>
      </section>

      <div className="container mx-auto p-4 min-h-[calc(50vh-4rem)] flex flex-col gap-12">
        {/* Top Rated Products */}
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-1">
              Top Rated Products
            </h2>
            <p className="text-sm md:text-lg font-light">
              Find the top rated products on{" "}
              <span className="font-semibold">re_view</span>. Get the best
              products based on real user
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 min-h-[300px]">
            {loading && (
              <>
                {[...Array(4)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </>
            )}

            {!loading &&
              topRatedProducts?.map((product, index) => {
                return (
                  <ProductCard
                    key={`product-$${product.id}-${index}`}
                    id={product.id}
                    name={product.name}
                    category={product.category}
                    image_url={product.image_url}
                    thumbnail={product.thumbnail}
                    rating={product.rating}
                    review_count={product.review_count}
                  />
                );
              })}
          </div>
        </section>

        {/* Products by Category */}
        {Object.keys(productsByCategory).map((category) => {
          const categoryProducts = productsByCategory[category]?.sort((a, b) =>
            (a.rating || 0) > (b.rating || 0) ? -1 : 1
          );

          return (
            <section key={category} className="flex flex-col gap-4">
              <div>
                <div className="flex gap-4 items-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-1 capitalize">
                    {category}
                  </h2>
                  <hr className="w-full border-t border-gray-300" />
                </div>

                <p className="text-sm md:text-lg font-light">
                  Find the best products in the {category} category. Get the
                  best products based on real user reviews.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 min-h-[300px]">
                {loading && (
                  <>
                    {[...Array(4)].map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </>
                )}

                {!loading &&
                  categoryProducts.map((product, index) => {
                    return (
                      <ProductCard
                        key={`product-$${product.id}-${index}`}
                        id={product.id}
                        name={product.name}
                        description={product.description}
                        image_url={product.image_url}
                        thumbnail={product.thumbnail}
                        category={product.category}
                        showCategory={false}
                        rating={product.rating}
                        review_count={product.review_count}
                      />
                    );
                  })}
              </div>
            </section>
          );
        })}
      </div>

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
