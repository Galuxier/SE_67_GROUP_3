import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ShopAPI from '../services/api/ShopApi';
import { useAuth } from './AuthContext';

// Create context
const ShopContext = createContext();

// Shop provider component
export const ShopProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userShops, setUserShops] = useState([]);
  const [currentShop, setCurrentShop] = useState(null);
  const [shopProducts, setShopProducts] = useState([]);
  const [shopOrders, setShopOrders] = useState([]);

  // Fetch user's shops
  const fetchUserShops = useCallback(async () => {
    if (!isLoggedIn || !user || !user.role?.includes('shop_owner')) {
      return;
    }

    try {
      setLoading(true);
      const shops = await ShopAPI.getUserShops();
      setUserShops(shops);
      
      // If no current shop is set and we have shops, set the first one
      if (!currentShop && shops.length > 0) {
        setCurrentShop(shops[0]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching user shops:', err);
      setError('Failed to load your shops');
      toast.error('Failed to load your shops. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, user, currentShop]);

  // Fetch shop by ID
  const fetchShopById = useCallback(async (shopId) => {
    if (!shopId) return;

    try {
      setLoading(true);
      const shop = await ShopAPI.getShopById(shopId);
      setCurrentShop(shop);
      setError(null);
      return shop;
    } catch (err) {
      console.error(`Error fetching shop with ID ${shopId}:`, err);
      setError('Failed to load shop details');
      toast.error('Failed to load shop details. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load shop products
  const fetchShopProducts = useCallback(async (shopId) => {
    if (!shopId) return;

    try {
      setLoading(true);
      const products = await ShopAPI.getShopProducts(shopId);
      setShopProducts(products);
      return products;
    } catch (err) {
      console.error('Error fetching shop products:', err);
      toast.error('Failed to load products. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load shop orders
  const fetchShopOrders = useCallback(async (shopId, status = '') => {
    if (!shopId) return;

    try {
      setLoading(true);
      const orders = await ShopAPI.getShopOrders(shopId, status);
      setShopOrders(orders);
      return orders;
    } catch (err) {
      console.error('Error fetching shop orders:', err);
      toast.error('Failed to load orders. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Update shop
  const updateShop = useCallback(async (shopId, shopData) => {
    try {
      setLoading(true);
      const updatedShop = await ShopAPI.updateShop(shopId, shopData);
      
      // Update current shop if it's the one being edited
      if (currentShop?._id === shopId) {
        setCurrentShop(updatedShop);
      }
      
      // Update the shop in the userShops array
      setUserShops(prev => prev.map(shop => 
        shop._id === shopId ? updatedShop : shop
      ));
      
      toast.success('Shop updated successfully!');
      return updatedShop;
    } catch (err) {
      console.error('Error updating shop:', err);
      toast.error('Failed to update shop. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentShop]);

  // Create product
  const createProduct = useCallback(async (productData) => {
    try {
      setLoading(true);
      const newProduct = await ShopAPI.createProduct(productData);
      
      // Add the new product to the products list
      setShopProducts(prev => [newProduct, ...prev]);
      
      toast.success('Product created successfully!');
      return newProduct;
    } catch (err) {
      console.error('Error creating product:', err);
      toast.error('Failed to create product. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Set current shop
  const switchShop = useCallback(async (shopId) => {
    const shop = userShops.find(s => s._id === shopId);
    
    if (shop) {
      setCurrentShop(shop);
      // Navigate to the shop management page
      navigate(`/shop/management/${shopId}`);
      return shop;
    } else {
      // If the shop isn't in the list, try to fetch it
      return await fetchShopById(shopId);
    }
  }, [userShops, navigate, fetchShopById]);

  // Load initial data if user is logged in
  useEffect(() => {
    if (isLoggedIn && user && user.role?.includes('shop_owner')) {
      fetchUserShops();
    }
  }, [isLoggedIn, user, fetchUserShops]);

  // Context value
  const value = {
    loading,
    error,
    userShops,
    currentShop,
    shopProducts,
    shopOrders,
    fetchUserShops,
    fetchShopById,
    fetchShopProducts,
    fetchShopOrders,
    updateShop,
    createProduct,
    switchShop,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

// Hook to use the shop context
export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShopContext must be used within a ShopProvider');
  }
  return context;
};

export default useShopContext;