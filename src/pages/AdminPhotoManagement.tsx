import React, { useState, useEffect } from 'react';
import { deletePhoto, fetchPhotos } from '../apis/admin';
import { Photo } from '../types/photos';

const AdminPhotoManagement: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPhotos = async () => {
            try {
                const data = await fetchPhotos();
                setPhotos(data);
            } catch (error) {
                setError('Error fetching photos');
            }
        };

        loadPhotos();
    }, []);

    const handleDeletePhoto = async (photoId: number) => {
        try {
            await deletePhoto(photoId);
            setPhotos(photos.filter(photo => photo.PhotoID !== photoId));
        } catch (error) {
            setError('Error deleting photo');
        }
    };

    return (
        <div>
            <h2>Manage Photos</h2>
            {error && <p>{error}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {photos.map(photo => (
                    <div key={photo.PhotoID} style={{ margin: '10px' }}>
                        <img
                            src={`http://localhost:3000/${photo.PhotoPath}`}
                            alt={photo.Description || 'No description available'}
                            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                            onError={(e) => {
                                e.currentTarget.src = '/placeholder.jpg';
                            }}
                        />
                        <p>{photo.Description || 'No description'}</p>
                        <p>By: {photo.User?.Username || 'Unknown'}</p>
                        <p>Uploaded: {new Date(photo.UploadDateTime).toLocaleString()}</p>
                        <p>Hashtags: {photo.Hashtags || 'No hashtags'}</p>
                        <button onClick={() => handleDeletePhoto(photo.PhotoID)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPhotoManagement;
