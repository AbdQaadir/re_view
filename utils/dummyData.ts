// const handlePopulateData = async () => {
//     const category = ProductCategory.Vehicle;
//     // Fetch products from dummy API
//     const response = await fetch(
//       `https://dummyjson.com/products/category/${category}?limit=5`
//     );
//     const data = await response.json();
//     console.log({ response, data });
//     // Format data in ProductType
//     const products = data?.products?.map(
//       (product: any): Partial<ProductType> => ({
//         name: product.title,
//         category: category,
//         description: product.description,
//         image_url: product.images[0],
//         thumbnail: product.thumbnail,
//       })
//     );

//     // Insert products to the database
//     const res = await supabase.from("product").insert(products);

//     console.log({ res });
//   };
