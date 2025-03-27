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

export async function getEvents() {
    try{
        const response = await api.get('/events');
        return response;
    }catch (error){
        console.error('Get All Events Failed: ', error);
        throw new error;
    }
}

export async function getEventsByOrganizerId(organizer_id) {
    try{
        const response = await api.get(`/organizer/${organizer_id}/events`)
        return response.data;
    }catch (error){
        throw new error;
    } 
}