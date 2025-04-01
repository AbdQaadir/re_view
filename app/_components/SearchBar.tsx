"use client";
import { Input } from "@/components/ui/input";
import { ProductType } from "@/types";
import { useMemo, useState } from "react";

type SearchBarProps = {
  products: ProductType[];
  onClick: (product: ProductType) => void;
};
export default function SearchBar({ onClick, products }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, products]);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <Input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full py-4 px-3 border rounded-lg text-xs md:text-sm focus:outline-none"
      />
      {query && (
        <div className="absolute w-full bg-white shadow-lg rounded-lg mt-1 max-h-60 overflow-y-auto">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="text-xs md:text-md p-3 border-b cursor-pointer hover:bg-gray-100 active:bg-gray-200"
                onClick={() => onClick(product)}
              >
                {product.name}
              </div>
            ))
          ) : (
            <p className="text-xs md:text-md p-3 text-gray-500">
              No products found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
