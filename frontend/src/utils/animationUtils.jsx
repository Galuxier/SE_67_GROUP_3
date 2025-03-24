import { EASE } from "framer-motion";

// Valid easing functions for Framer Motion
export const easings = {
  // Standard easings
  easeInOut: [0.42, 0, 0.58, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  
  // Custom easings (using valid values)
  // Replace any problematic cubic-bezier with these valid ones
  customEaseInOut: [0.6, 0.05, 0.4, 0.9], // Fixed version
  gentle: [0.25, 0.1, 0.25, 1],
  bounce: [0.175, 0.885, 0.32, 1.275],
//   gentle: [0.4, 0, 0.2, 1],
  
  // You can use framer motion's built-in easings
  anticipate: EASE.anticipate,
  backInOut: EASE.backInOut,
  backIn: EASE.backIn,
  backOut: EASE.backOut,
  circInOut: EASE.circInOut,
  circIn: EASE.circIn,
  circOut: EASE.circOut
};

// Common animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.3,
      ease: easings.easeOut
    }
  }
};

export const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.3,
      ease: easings.customEaseInOut
    }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2,
      ease: easings.easeOut
    }
  }
};

// Animation for cards
export const cardAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easings.easeOut } },
  hover: { y: -5, transition: { duration: 0.3, ease: easings.easeOut } },
  tap: { scale: 0.98, transition: { duration: 0.1, ease: easings.easeOut } }
};

// Animation for modal
export const modalAnimation = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: easings.backOut
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { 
      duration: 0.2,
      ease: easings.easeIn
    }
  }
};