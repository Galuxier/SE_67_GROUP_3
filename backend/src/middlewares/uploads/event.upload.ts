import createUploader from './base.upload';

export const eventPosterUpload = createUploader(1, true, 'events/posters');

export const eventSeatZoneUpload = createUploader(2, false, 'events/seat-zones', [
    'image/',
    'application/pdf', // รองรับ PDF
  ]);
