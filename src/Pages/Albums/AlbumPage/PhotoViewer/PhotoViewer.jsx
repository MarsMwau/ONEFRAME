import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './PhotoViewer.css';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DeleteIcon from '@mui/icons-material/Delete';

const PhotoViewer = ({ selectedPhoto, setSelectedPhoto, onClose, photos, onDelete }) => {
  const { photoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = photos.findIndex(photo => photo._id === photoId);
  const [touchStartX, setTouchStartX] = useState(0);

  const handleNextPhoto = () => {
    if (currentIndex < photos.length - 1) {
      const nextPhotoId = photos[currentIndex + 1]._id;
      navigate(`${location.pathname.split('/').slice(0, -1).join('/')}/${nextPhotoId}`);
    }
  };

  const handlePreviousPhoto = () => {
    if (currentIndex > 0) {
      const prevPhotoId = photos[currentIndex - 1]._id;
      navigate(`${location.pathname.split('/').slice(0, -1).join('/')}/${prevPhotoId}`);
    }
  };

  const handleSwipe = (direction) => {
    if (direction === 'left') {
      handleNextPhoto();
    } else if (direction === 'right') {
      handlePreviousPhoto();
    }
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;
    if (diffX > 50) {
      handleSwipe('left');
    } else if (diffX < -50) {
      handleSwipe('right');
    }
  };

  const handleDeletePhoto = () => {
    onDelete(selectedPhoto);
    setSelectedPhoto(null);
    navigate(`/album/${selectedPhoto.albumId}`);
  };

  return (
    <div className="photo-viewer" onPointerUp={handleSwipe}>
      <div className="photo-viewer-content"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <h3 className="photo-ttl">{selectedPhoto.title}</h3>
        <CloseIcon className="close-icon" onClick={onClose} />
        <img src={selectedPhoto.imageUrl} alt={selectedPhoto.title} />
        <ArrowBackIosIcon className="nav-icon prev-icon" onClick={handlePreviousPhoto} />
        <ArrowForwardIosIcon className="nav-icon next-icon" onClick={handleNextPhoto} />
        <DeleteIcon className="delete-icon" onClick={handleDeletePhoto} />
      </div>
    </div>
  );
};

export default PhotoViewer;