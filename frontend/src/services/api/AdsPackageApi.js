import { api } from "../Axios";

// Mock data สำหรับ development
const mockPackages = [
  {
    _id: "1",
    type: "course",
    name: "Standard Course Package",
    detail: "30-day advertising for courses",
    duration: 30,
    price: 999,
    status: "active"
  },
  {
    _id: "2",
    type: "event",
    name: "Premium Event Package",
    detail: "60-day advertising for events",
    duration: 60,
    price: 1999,
    status: "active"
  },
  {
    _id: "3",
    type: "course",
    name: "Advanced Course Package",
    detail: "90-day advertising for courses",
    duration: 90,
    price: 2499,
    status: "active"
  }
];

// Mock purchased packages
const mockPurchased = [
  {
    _id: "p1",
    type: "course",
    name: "Standard Course Package",
    detail: "30-day advertising for courses",
    duration: 30,
    price: 999,
    status: "active",
    expiryDate: "2023-12-31"
  }
];

export async function createAdsPackage(packageData) {
  try {
    // สำหรับ development ใช้ mock data
    if (process.env.NODE_ENV === 'development') {
      console.log('Creating package with data:', packageData);
      
      const newPackage = {
        _id: Math.random().toString(36).substring(2, 9),
        ...packageData,
        status: "active"
      };
      mockPackages.push(newPackage);
      console.log('Mock package created:', newPackage);
      return newPackage;
    }

    // สำหรับ production ใช้ API จริง
    const formData = new FormData();
    formData.append("type", packageData.type);
    formData.append("name", packageData.name);
    formData.append("detail", packageData.detail);
    formData.append("duration", packageData.duration);
    formData.append("price", packageData.price);
    
    const response = await api.post("/ads-packages", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create ads package:", error);
    throw error;
  }
}

export async function getAdsPackages() {
  try {
    // สำหรับ development ใช้ mock data
    if (process.env.NODE_ENV === 'development') {
      console.log('Returning mock packages');
      return mockPackages;
    }

    // สำหรับ production ใช้ API จริง
    const response = await api.get("/ads-packages");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch ads packages:", error);
    throw error;
  }
}

export async function getPurchasedPackages(type) {
  try {
    // สำหรับ development ใช้ mock data
    if (process.env.NODE_ENV === 'development') {
      console.log(`Returning mock purchased packages for ${type}`);
      return mockPurchased.filter(pkg => pkg.type === type);
    }

    // สำหรับ production ใช้ API จริง
    const response = await api.get(`/user/purchased-packages?type=${type}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch purchased packages:", error);
    throw error;
  }
}

export async function purchasePackage(packageId) {
  try {
    // สำหรับ development ใช้ mock data
    if (process.env.NODE_ENV === 'development') {
      console.log(`Mock purchasing package ${packageId}`);
      const pkg = mockPackages.find(p => p._id === packageId);
      if (pkg) {
        const purchased = {
          ...pkg,
          _id: `p${Math.random().toString(36).substring(2, 9)}`,
          expiryDate: new Date(Date.now() + pkg.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        mockPurchased.push(purchased);
        return purchased;
      }
      throw new Error('Package not found');
    }

    // สำหรับ production ใช้ API จริง
    const response = await api.post(`/packages/${packageId}/purchase`);
    return response.data;
  } catch (error) {
    console.error("Failed to purchase package:", error);
    throw error;
  }
}