import React from "react";

// ✅ Define Backend URL
const BACKEND_URL = "http://localhost:5000";

const UserAvatar = ({ src, alt, className }) => {
  // 1. HELPER: Determine the correct image source
  const getImageSrc = (url) => {
    // A. If data is missing, loading, or explicitly "undefined", show placeholder
    if (!url || url === "undefined" || url === "null") {
      return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    }

    // B. If it's a full URL (Google/Cloudinary), use it
    if (url.startsWith("http") || url.startsWith("blob")) return url;

    // C. If it's a local file, add backend URL + timestamp to force refresh
    return `${BACKEND_URL}${url}?t=${new Date().getTime()}`;
  };

  return (
    <img
      src={getImageSrc(src)}
      alt={alt || "User Avatar"}
      className={className}
      // Safety net: If the backend image fails to load, switch to placeholder
      onError={(e) => {
        e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
      }}
    />
  );
};

export default UserAvatar;