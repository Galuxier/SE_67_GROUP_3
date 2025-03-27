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

export async function getTeachHistoriesByUserId(user_id) {
  try{
    const response = await api.get(`/user/${user_id}/teachHistories`);
    return response;
  }catch (error){
    throw new error;
  }
}
