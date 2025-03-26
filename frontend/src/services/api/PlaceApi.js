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