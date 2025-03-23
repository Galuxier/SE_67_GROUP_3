// Validation function for shop names
export const validateShopName = (name) => {
    // Check if name is empty
    if (!name.trim()) {
      return {
        isValid: false,
        errorMessage: "Shop name is required"
      };
    }
    
    // Check if name contains only letters, numbers, and spaces
    // This regex allows letters, numbers, and spaces but no special characters
    const validNameRegex = /^[A-Za-z0-9\s]+$/;
    if (!validNameRegex.test(name)) {
      return {
        isValid: false,
        errorMessage: "Shop name can only contain letters, numbers, and spaces"
      };
    }
    
    // If length is too short
    if (name.trim().length < 3) {
      return {
        isValid: false,
        errorMessage: "Shop name must be at least 3 characters long"
      };
    }
    
    // If length is too long
    if (name.trim().length > 50) {
      return {
        isValid: false,
        errorMessage: "Shop name cannot exceed 50 characters"
      };
    }
    
    // If all checks pass
    return {
      isValid: true,
      errorMessage: ""
    };
  };
  
  // Function to check if shop name is unique (to be used with API)
  export const checkShopNameUniqueness = async (shopName, apiCheckFunction) => {
    try {
      // Call the API function to check if shop name exists
      const result = await apiCheckFunction(shopName);
      
      // The API should return whether the name is available or not
      if (result.isAvailable) {
        return {
          isUnique: true,
          errorMessage: ""
        };
      } else {
        return {
          isUnique: false,
          errorMessage: "This shop name is already taken. Please choose another name."
        };
      }
    } catch (error) {
      console.error("Error checking shop name uniqueness:", error);
      return {
        isUnique: false,
        errorMessage: "Unable to verify shop name availability. Please try again."
      };
    }
  };