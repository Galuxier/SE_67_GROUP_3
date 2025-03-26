import { Schema, model, Document } from 'mongoose';

interface Address {
  province: string;
  district: string;
  subdistrict: string;
  street: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  information?: string; // optional field
}

// Define the Place document interface
export interface PlaceDocument extends Document {
  owner_id: Schema.Types.ObjectId;
  name: string;
  price: number;
  address: Address;
  google_map_link?: string;
  place_image_urls: string[];
}

// Create the Place schema with embedded address
const PlaceSchema = new Schema<PlaceDocument>({
  owner_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  address: {
    province: { type: String, required: true },
    district: { type: String, required: true },
    subdistrict: { type: String, required: true },
    street: { type: String, required: false },
    postal_code: { type: String, required: true },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    information: { type: String, required: false },
  },
  google_map_link: { type: String, required: false },
  place_image_urls: { type: [String], required: true },
});

// Create the Place model
export const Place = model<PlaceDocument>('Place', PlaceSchema);