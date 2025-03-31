import { ProductCategory } from "@/app/_constants";
import { FakeProductType } from "@/types";

export const getFakeProductCategoryName = (
  category: FakeProductType["category"]
) => {
  if (category === "electronics") return ProductCategory.Electronics;
  if (category === "jewelery") return ProductCategory.Jewelery;
  if (category === "men's clothing") return ProductCategory.Men_Clothing;
  if (category === "women's clothing") return ProductCategory.Women_Clothing;
};
