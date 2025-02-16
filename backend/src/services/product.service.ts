import { Product, ProductDocument } from '../models/product.model';

export const createProduct = async (productData: ProductDocument) => {
  return await Product.create(productData);
};

export const getProducts = async () => {
  return await Product.find().populate('shop');
};

export const getProductById = async (productId: string) => {
  return await Product.findById(productId).populate('shop');
};

export const updateProduct = async (productId: string, updateData: Partial<ProductDocument>) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');
  Object.assign(product, updateData);
  return await product.save();
};

export const deleteProduct = async (productId: string) => {
  return await Product.findByIdAndDelete(productId);
};
