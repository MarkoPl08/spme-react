import React, { useState, useEffect } from 'react';
import { fetchPhotos } from '../apis/photos';
import { Photo } from '../types/photos';
import { useNavigate } from 'react-router-dom';

const PhotoGallery: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadPhotos = async () => {
            try {
                const data = await fetchPhotos();
                console.log('Fetched photos:', data);
                setPhotos(data);
            } catch (error) {
                setError('Error fetching photos');
            }
        };

        loadPhotos();
    }, []);

    const handleBackToUpload = () => {
        navigate('/upload');
    };

    return (
        <div>
            <h1>Photo Gallery</h1>
            {error && <p>{error}</p>}
            <button onClick={handleBackToUpload}>Back to Upload</button>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {photos.map(photo => (
                    <div key={photo.PhotoID} style={{ margin: '10px' }}>
                        <img
                            src={`http://localhost:3000/${photo.PhotoPath}`}
                            alt={photo.Description || 'No description available'}
                            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                            onError={(e) => console.error('Image load error:', e.currentTarget.src)}
                        />
                        <p>{photo.Description || 'No description'}</p>
                        <p>By: {photo.User.Username}</p>
                        <p>Uploaded: {new Date(photo.UploadDateTime).toLocaleString()}</p>
                        <p>Hashtags: {photo.Hashtags || 'No hashtags'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PhotoGallery;
