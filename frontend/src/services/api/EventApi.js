import { api } from "../Axios";

export async function createEvent(EventData) {
    try{
        const response = await api.post('/events', EventData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error){
        console.error('Create Event Error: ', error);
        throw error;
    }
    
}