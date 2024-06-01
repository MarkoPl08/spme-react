import React, { useState, useEffect } from 'react';
import { fetchPhotos, updatePhoto, downloadOriginalPhoto, downloadProcessedPhoto } from '../apis/photos';
import { Photo } from '../types/photos';
import { useNavigate } from 'react-router-dom';

const PhotoGallery: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [description, setDescription] = useState<string>('');
    const [hashtags, setHashtags] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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

    const handleUpdatePhoto = async (photoId: number) => {
        try {
            const updatedPhoto = await updatePhoto(photoId, description, hashtags);
            setPhotos(photos.map(photo => photo.PhotoID === photoId ? { ...photo, ...updatedPhoto } : photo));
            setSelectedPhoto(null);
            setDescription('');
            setHashtags('');
        } catch (error) {
            setError('Error updating photo');
        }
    };

    return (
        <div>
            <h1>Photo Gallery</h1>
            {error && <p>{error}</p>}
            <button onClick={() => navigate('/upload')}>Back to Upload</button>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {photos.map(photo => (
                    <div key={photo.PhotoID} style={{margin: '10px'}}>
                        <img
                            src={`http://localhost:3000/uploads/${photo.PhotoPath}`}
                            alt={photo.Description || 'No description available'}
                            style={{width: '200px', height: '200px', objectFit: 'cover'}}
                            onError={(e) => {
                                e.currentTarget.src = '/placeholder.jpg';
                            }}
                        />
                        <p>{photo.Description || 'No description'}</p>
                        <p>By: {photo.User?.Username || 'Unknown'}</p>
                        <p>Uploaded: {new Date(photo.UploadDateTime).toLocaleString()}</p>
                        <p>Hashtags: {photo.Hashtags || 'No hashtags'}</p>
                        <button onClick={() => {
                            setSelectedPhoto(photo);
                            setDescription(photo.Description || '');
                            setHashtags(photo.Hashtags || '');
                        }}>Edit
                        </button>
                        <button onClick={() => downloadOriginalPhoto(photo.PhotoID)}>Download Original</button>
                        <button onClick={() => downloadProcessedPhoto(photo.PhotoID)}>Download Processed</button>
                    </div>
                ))}
            </div>
            {selectedPhoto && (
                <div key={selectedPhoto.PhotoID}>
                    <h2>Edit Photo</h2>
                    <p>Photo ID: {selectedPhoto.PhotoID}</p>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                    />
                    <input
                        type="text"
                        value={hashtags}
                        onChange={(e) => setHashtags(e.target.value)}
                        placeholder="Hashtags"
                    />
                    <button onClick={() => handleUpdatePhoto(selectedPhoto.PhotoID)}>Update</button>
                    <button onClick={() => setSelectedPhoto(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default PhotoGallery;
