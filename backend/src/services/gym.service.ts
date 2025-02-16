import { Gym, GymDocument } from '../models/gym.model';

export const createGym = async (gymData: GymDocument) => {
  return await Gym.create(gymData);
};

export const getGyms = async () => {
  return await Gym.find();
};

export const getGymById = async (gymId: string) => {
  return await Gym.findById(gymId);
};

export const updateGym = async (gymId: string, updateData: Partial<GymDocument>) => {
  const gym = await Gym.findById(gymId);
  if (!gym) throw new Error('Gym not found');
  Object.assign(gym, updateData);
  return await gym.save();
};

export const deleteGym = async (gymId: string) => {
  return await Gym.findByIdAndDelete(gymId);
};
