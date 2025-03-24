import app from '../../app';
import createUploader from './base.upload';

export const eventImageUpload = createUploader([
  {
    subfolder: 'event/poster',
    allowedMimeTypes: ['image/'],
    name: 'poster_url',
    maxCount: 1,
  },{
    subfolder: 'event/seatZone',
    allowedMimeTypes: ['image/'],
    name: 'seatZone_url',
    maxCount: 1,
  }
]);