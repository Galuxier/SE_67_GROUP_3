export const products = [
  {
    id: 101,
    shop_owner_id: "1", // อ้างถึงร้าน owner_id=1
    product_name: "Universal Gloves Tight-Fit Design",
    image_url: new URL("../assets/images/product-001.webp", import.meta.url).href,
    description: "High-quality gloves for Muay Thai and Boxing.",
    options: [
      { name: "color", isMain: true },
      { name: "size", isMain: false },
    ],
    variants: [
      {
        attribute: { color: "Black", size: "S" },
        variantImage_url: new URL("../assets/images/Glove_black.jpg", import.meta.url).href,
        price: 1000,
        stock: 10,
      },
      {
        attribute: { color: "Black", size: "M" },
        variantImage_url: new URL("../assets/images/Glove_black.jpg", import.meta.url).href,
        price: 1100,
        stock: 11,
      },
      {
        attribute: { color: "Red", size: "L" },
        variantImage_url: new URL("../assets/images/Glove_red.jpg", import.meta.url).href,
        price: 1200,
        stock: 12,
      },
    ],
  },
  {
    id: 102,
    shop_owner_id: "1",
    product_name: "Muay Thai Shorts",
    image_url: new URL("../assets/images/product-002.webp", import.meta.url).href,
    description: "Limited Edition : Fairtex X Future LAB Boxing Shorts",
    options: [
      { name: "color", isMain: true },
      { name: "size", isMain: false },
    ],
    variants: [
      {
        attribute: { color: "Black", size: "M" },
        variantImage_url: new URL("../assets/images/product-002.webp", import.meta.url).href,
        price: 900,
        stock: 5,
      },
      {
        attribute: { color: "Blue", size: "S" },
        variantImage_url: new URL("../assets/images/product-002.webp", import.meta.url).href,
        price: 950,
        stock: 6,
      },
    ],
  },
  {
    id: 103,
    shop_owner_id: "2",
    product_name: "Finger Tape for BJJ and MMA",
    image_url: new URL("../assets/images/product-003.webp", import.meta.url).href,
    description: "Protect your fingers during grappling sessions.",
    price: 200,
    stock: 50,
  },
];
