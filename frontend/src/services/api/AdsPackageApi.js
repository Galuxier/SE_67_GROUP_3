import { api } from "../Axios";

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

export async function createAdsPackage(formData) {
  try {
    // ตรวจสอบว่ามี status หรือไม่ ถ้าไม่มีให้เพิ่มค่า default
    if (!formData.has('status')) {
      formData.append('status', 'active');
    }

    const response = await api.post("/adsPackages", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create ads package:", error);
    if (error.response) {
      console.error("Server response:", error.response.data);
      throw new Error(error.response.data.message || "Failed to create package");
    }
    throw error;
  }
}

export async function getAdsPackages() {
  try {
    const response = await api.get("/adsPackages/active");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch ads packages:", error);
    throw error;
  }
}

export async function getAdsPackagesByType(type) {
  try {
    const response = await api.get(`/adsPackages/type/${type}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch ${type} ads packages:`, error);
    throw error;
  }
}

export async function updateAdsPackge(_id, newData) {
    try{
      const response = await api.put(`/adsPackage/${_id}`, newData, {
        headers: 'multipart/form-data',
      });
      return response.data;
    }catch (error){
      throw new error;
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

export async function togglePackageActive(packageId, active) {
  try {
    // สำหรับ development ใช้ mock data
    // if (process.env.NODE_ENV === 'development') {
    //   console.log(`Mock toggling package ${packageId} to ${active ? 'active' : 'inactive'}`);
    //   const index = mockPurchased.findIndex(p => p._id === packageId || p.packageId === packageId);
    //   if (index !== -1) {
    //     mockPurchased[index].status = active ? "active" : "inactive";
    //     console.log(`Package status updated:`, mockPurchased[index]);
    //     return mockPurchased[index];
    //   }
    //   throw new Error('Package not found');
    // }

    // สำหรับ production ใช้ API จริง
    const response = await api.patch(`/user/packages/${packageId}/active`, {
      active
    });
    return response.data;
  } catch (error) {
    console.error("Failed to toggle package status:", error);
    throw error;
  }
}

export async function getAdsPackageById(packageId) {
  try {
    const response = await api.get(`/adsPackage/${packageId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch ads package:", error);
    throw error;
  }
}