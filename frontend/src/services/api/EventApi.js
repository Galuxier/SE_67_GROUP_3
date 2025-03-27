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

export async function getEventsByOrganozerId(organizer_id) {
    try{
        const response = await api.get(`/organizer/${organizer_id}/events`)
        return response.data;
    }catch (error){
        throw new error;
    } 
}

/**
 * Search for events with various filter options
 * @param {Object} params - Search parameters
 * @param {string} [params.query] - Search text to match against event name and description
 * @param {string} [params.level] - Filter by event level
 * @param {string} [params.province] - Filter by province name
 * @param {string} [params.location_name] - Filter by location name
 * @param {string} [params.min_date] - Minimum start date filter (ISO date string)
 * @param {string} [params.max_date] - Maximum end date filter (ISO date string)
 * @param {number} [params.page=1] - Page number for pagination
 * @param {number} [params.limit=10] - Number of results per page
 * @param {string} [params.sort] - Sort order (price-low-to-high, price-high-to-low, newest)
 * @returns {Promise<Object>} Response object containing events array and pagination info
 */
export async function searchEvents(params = {}) {
    try {
      const response = await api.get('/events/search', { params });
      return response.data;
    } catch (error) {
      console.error('Search Events Failed: ', error);
      throw error;
    }
  }