/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";

const ImageViewer = ({ images, currentIndex, isOpen, onClose }) => {
  const [index, setIndex] = useState(currentIndex || 0);
  
  // Reset index when currentIndex changes
  useEffect(() => {
    if (currentIndex !== undefined) {
      setIndex(currentIndex);
    }
  }, [currentIndex]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, index, images?.length, onClose]);
  
  // Prevent body scroll when viewer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  
  if (!isOpen || !images || images.length === 0) return null;
  
  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  const handlePrev = () => {
    setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-[10000]"
            onClick={onClose}
          >
            <XMarkIcon className="h-8 w-8" />
          </button>
          
          {/* Counter */}
          <div className="absolute top-4 left-4 text-white text-sm">
            {index + 1} / {images.length}
          </div>
          
          {/* Main image */}
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full max-w-4xl max-h-[80vh] p-10 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[index]}
              alt={`Full size image ${index + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
          
          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              
              <button
                className="absolute right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageViewer;