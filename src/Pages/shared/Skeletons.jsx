import React from "react";
import { Skeleton } from "@mui/material";

// 1. Skeleton for the Pinterest-style Masonry layout (Home & Album pages)
export const MasonrySkeleton = () => {
  // Create an array of 8 empty items with random heights to mimic Pinterest
  const skeletonItems = Array.from(new Array(8)).map((_, index) => ({
    id: index,
    height: Math.floor(Math.random() * (300 - 150 + 1)) + 150, // Random height between 150px and 300px
  }));

  return (
    <div className="gallery">
      {skeletonItems.map((item) => (
        <div 
          className="gallery-item" 
          key={item.id} 
          style={{ height: `${item.height}px`, marginBottom: "15px" }}
        >
          <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
        </div>
      ))}
    </div>
  );
};

// 2. Skeleton for the Album Grid layout (Albums List page)
export const GridSkeleton = () => {
  return (
    <div className="albums-container">
      {Array.from(new Array(6)).map((_, index) => (
        <div className="album-card" key={index}>
          <div className="album-image" style={{ boxShadow: "none" }}>
            <Skeleton variant="rectangular" width="100%" height={200} animation="wave" />
            <div className="album-details" style={{ padding: "12px 0" }}>
              <Skeleton variant="text" width="60%" height={30} animation="wave" />
              <Skeleton variant="circular" width={24} height={24} animation="wave" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 3. Skeleton for the Profile Header
export const ProfileHeaderSkeleton = () => {
  return (
    <div className="profile-header">
      <div className="avatar-wrapper">
        <Skeleton variant="circular" width={120} height={120} className="modern-avatar" animation="wave" />
      </div>
      <div className="profile-info" style={{ width: "200px" }}>
        <Skeleton variant="text" width="80%" height={40} animation="wave" />
        <Skeleton variant="text" width="60%" height={20} animation="wave" />
      </div>
    </div>
  );
};