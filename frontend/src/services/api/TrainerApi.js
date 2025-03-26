import { api } from "../Axios";

export async function getTrainersInGym(gym_id) {
  try{
    const response = await api.get(`/gym/${gym_id}/trainers`);
    return response.data;
  }catch (error){
    console.error("Cannot get Trainer in Gym: ", error);
    throw new error;
  }
}
