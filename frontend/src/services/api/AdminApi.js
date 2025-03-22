import { api } from "../Axios";

export async function getAllEnrollment() {
    try{
        const response = await api.get('/enrollments');
        return response.data;
    } catch (error){
        console.error('Get All Gym Faild: ', error);
        throw error;
    }
}

export async function updateEnrollment(id, updateForm) {
    try{
        const response = await api.put(`/enrollment/${id}`, updateForm, {
            headers: {
                'Content-Type' : 'multipart/form-data',
            },
        });
        return response.data;
    }catch (error){
        console.error('Update Enrollment Failed: ', error.response?.data || error);
        throw new Error(error.response?.data?.message || 'Failed to Update Enrollment');
    }
}