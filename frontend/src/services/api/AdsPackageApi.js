import { api } from "../Axios";

export async function createAdsPackage(formData) {
  try {
    const response = await api.post("/adsPackages", formData, {
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