import createUploader from './base.upload';

export const eventSeatZoneUpload = createUploader(2, false, 'events/seat-zones', [
  'image/',
  'application/pdf', // รองรับ PDF
]);
