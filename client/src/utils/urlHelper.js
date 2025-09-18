import config from "../config/config";

// Utility function to get the full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If imagePath is already a full URL (Cloudinary), return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's a relative path (legacy local images), prepend the API URL
  return `${config.API_URL}${imagePath}`;
};

// Utility function to get API endpoint URL
export const getApiUrl = (endpoint) => {
  return `${config.API_URL}${endpoint}`;
};

export default { getImageUrl, getApiUrl };
