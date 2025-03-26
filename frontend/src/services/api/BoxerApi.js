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