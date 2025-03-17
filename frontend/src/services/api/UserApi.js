import { api } from "../Axios";

export async function getUser(_id) {
    try{
        const response = await api.get(`/user/${_id}`);
        console.log(response.data);
        return response.data;
    } catch(error){
        console.error('Failed to get User: ', error);
        throw error;
    }
    
}

export async function getUserProfile(username) {
    try{
        console.log("username: ", username);
        const response = await api.get(`/user/profile/${username}`);
        console.log(response.data);
        return response.data;
    } catch(error){
        console.error('Failed to get User: ', error);
        throw error;
    }
    
}

export async function updateUser(userId, userData) { 
    try {
        const response = await api.put(`/user/${userId}`, userData);
        return response.data;
    } catch(error) {
        console.error('Update User Failed: ', error);
        throw error;
    }   
}

export async function submitEnrollment(formData) {
    try {
      const response = await api.post('/user/enrollment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Enrollment request failed:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Failed to submit enrollment request');
    }
  }