export const products = [
  {
    id: 1,
    product_name: "Fancy Boxing Gloves",
    image_url: new URL("../../assets/images/product-001.webp", import.meta.url).href,
    options: [
      { name: "color", isMain: true },
      { name: "size", isMain: false },
    ],
    variants: [
      {
        attribute: { color: "Black", size: "S" },
        variantImage_url: new URL("../../assets/images/Glove_black.jpg", import.meta.url).href,
        price: 1000,
        stock: 10,
      },
      {
        attribute: { color: "Black", size: "M" },
        variantImage_url: new URL("../../assets/images/Glove_black.jpg", import.meta.url).href,
        price: 1100,
        stock: 11,
      },
      {
        attribute: { color: "Red", size: "L" },
        variantImage_url: new URL("../../assets/images/Glove_red.jpg", import.meta.url).href,
        price: 1200,
        stock: 12,
      },
      {
        attribute: { color: "White", size: "M" },
        variantImage_url: new URL("../../assets/images/Glove_white.jpg", import.meta.url).href,
        price: 1200,
        stock: 12,
      },
    ],
    description: "High-quality boxing gloves with multi-color options.",
  },
  {
    id: 2,
    product_name: "Muay Thai Shorts",
    image_url: new URL("../../assets/images/product-002.webp", import.meta.url).href,
    options: [
      { name: "color", isMain: true },
      { name: "size", isMain: false },
    ],
    variants: [
      {
        attribute: { color: "Black", size: "M" },
        variantImage_url: new URL("../../assets/images/product-002.webp", import.meta.url).href,
        price: 900,
        stock: 5,
      },
      {
        attribute: { color: "Blue", size: "M" },
        variantImage_url: new URL("../../assets/images/product-002.webp", import.meta.url).href,
        price: 950,
        stock: 6,
      },
    ],
    description: "Durable Muay Thai shorts for everyday training.",
  },
  {
    id: 3,
    product_name: "Finger Tape for BJJ and MMA",
    image_url: new URL("../../assets/images/product-003.webp", import.meta.url).href,
    price: 200,
    stock: 50,
    description: "Protect your fingers during grappling sessions.",
  },
];
