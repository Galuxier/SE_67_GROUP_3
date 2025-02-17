import { TeachHistory, TeachHistoryDocument } from '../models/teachHistory.model';

export const createTeachHistory = async (historyData: TeachHistoryDocument) => {
  return await TeachHistory.create(historyData);
};

export const getTeachHistories = async () => {
  return await TeachHistory.find().populate('trainer course');
};

export const getTeachHistoryById = async (historyId: string) => {
  return await TeachHistory.findById(historyId).populate('trainer course');
};

export const updateTeachHistory = async (historyId: string, updateData: Partial<TeachHistoryDocument>) => {
  const history = await TeachHistory.findById(historyId);
  if (!history) throw new Error('TeachHistory not found');
  Object.assign(history, updateData);
  return await history.save();
};

export const deleteTeachHistory = async (historyId: string) => {
  return await TeachHistory.findByIdAndDelete(historyId);
};
