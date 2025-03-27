
import { api } from "../Axios";

export async function getBoxerInGym(gym_id) {
  try{
    const response = await api.get(`/gym/${gym_id}/boxers`);
    return response.data;
  }catch (error){
    console.error("Cannot get boxer in Gym: ", error);
    throw new error;
  }
}

export async function getBoxers() {
  try{
    const response = await api.get('/boxers');
    return response.data;
  } catch (error) {
    throw new error;
  }
}

export async function getFightHistoriesByUserId(user_id) {
  try{
    const response = await api.get(`/user/${user_id}/fightHistories`);
    return response;
  }catch (error){
    throw new error;
  }
}