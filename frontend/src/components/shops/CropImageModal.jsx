import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export default function CropImageModal({ show, onClose, file, onCropDone }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const imageURL = file ? URL.createObjectURL(file) : null;

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!imageURL || !croppedAreaPixels) return;
    const croppedBlob = await getCroppedCircleImg(imageURL, croppedAreaPixels);
    onCropDone(croppedBlob);
  };

  async function getCroppedCircleImg(imageSrc, pixelCrop) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.beginPath();
        ctx.arc(
          pixelCrop.width / 2, 
          pixelCrop.height / 2, 
          Math.min(pixelCrop.width, pixelCrop.height) / 2, 
          0, 
          2 * Math.PI
        );
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/png", 1);
      };
      image.onerror = (err) => reject(err);
    });
  }

  if (!show || !file) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-md relative w-[90%] max-w-xl">
        <button onClick={onClose} className="absolute top-2 right-2">
          ✕
        </button>
        <h2 className="text-xl font-bold mb-2">Crop Circle Image</h2>

        <div className="relative w-full h-64 bg-gray-200">
          {imageURL && (
            <Cropper
              image={imageURL}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <label>Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
