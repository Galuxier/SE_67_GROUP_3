import { api } from "../Axios";

export async function createPlace(placeData){
    try{
        const response = await api.post('/places', placeData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch(error){
        console.error('Create Place Failed: ', error);
        throw error;
    }
}

export async function getPlaces() {
    try{
        const response = await api.get('/places');
        return response.data;
    } catch(error){
        console.error(error);
        throw new error;
    }
}

export async function getPlacesByOwnerId(ownerId) {
    try {
      const response = await api.get(`/owner/${ownerId}/places`);
      return response.data;
    } catch (error) {
      console.error('Get Places by Owner Failed: ', error);
      throw error;
    }
  }

  export async function getPlaceById(id) {
    try {
      const response = await api.get(`/place/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get Place Failed: ', error);
      throw error;
    }
  }