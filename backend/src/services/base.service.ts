import { Model, Document } from 'mongoose';

export class BaseService<T extends Document> {
  constructor(private model: Model<T>) {}

  async add(data: Partial<T>): Promise<T> {
    const item = new this.model(data);
    return await item.save();
  }

  async getAll(): Promise<T[]> {
    return await this.model.find();
  }

  async getById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }
}
