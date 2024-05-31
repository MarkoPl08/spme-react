import React, { useState } from 'react';
import { searchPhotos } from '../apis/photos';
import { Photo } from '../types/photos';

const PhotoSearch: React.FC = () => {
    const [description, setDescription] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [username, setUsername] = useState('');
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        try {
            const data = await searchPhotos({ description, hashtags, startDate, endDate, username });
            setPhotos(data);
        } catch (error) {
            setError('Error searching photos');
        }
    };

    return (
        <div>
            <h1>Search Photos</h1>
            <div>
                <input
                    type="text"
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
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Start Date"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="End Date"
                />
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            {error && <p>{error}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {photos.map(photo => (
                    <div key={photo.PhotoID} style={{ margin: '10px' }}>
                        <img
                            src={`/${photo.PhotoPath}`}
                            alt={photo.Description || 'No description available'}
                            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
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

export default PhotoSearch;
